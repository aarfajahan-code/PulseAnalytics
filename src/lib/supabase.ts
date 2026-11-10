import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RealtimeMessage } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Realtime Channel abstraction supporting BroadcastChannel & Supabase
const BROADCAST_CHANNEL_NAME = 'pulse_analytics_realtime_v1';

class RealtimeHub {
  private broadcastChannel: BroadcastChannel | null = null;
  private listeners: Set<(message: RealtimeMessage) => void> = new Set();
  public instanceId: string = Math.random().toString(36).substring(2, 9);

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      this.broadcastChannel.onmessage = (event) => {
        const msg = event.data as RealtimeMessage;
        if (msg && msg.senderId !== this.instanceId) {
          this.notifyListeners(msg);
        }
      };
    }
  }

  public subscribe(callback: (message: RealtimeMessage) => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public broadcast<T>(type: RealtimeMessage['type'], payload: T, senderName = 'Collaborator') {
    const message: RealtimeMessage<T> = {
      type,
      senderId: this.instanceId,
      senderName,
      timestamp: new Date().toISOString(),
      payload,
    };

    // 1. Broadcast locally to this window's state subscribers if needed
    // 2. Broadcast to other tabs via Web BroadcastChannel
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(message);
    }

    // 3. Broadcast to Supabase Realtime if configured
    if (supabase) {
      const channel = supabase.channel('pulse-realtime-global');
      channel.send({
        type: 'broadcast',
        event: type,
        payload: message,
      });
    }

    return message;
  }

  private notifyListeners(message: RealtimeMessage) {
    this.listeners.forEach((listener) => {
      try {
        listener(message);
      } catch (err) {
        console.error('RealtimeHub listener error:', err);
      }
    });
  }
}

export const realtimeHub = new RealtimeHub();
