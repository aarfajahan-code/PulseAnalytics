import { useEffect, useCallback } from 'react';
import { realtimeHub } from '../lib/supabase';
import { useDashboardStore } from '../store/useDashboardStore';
import { RealtimeMessage, MetricItem, Category, Timeframe } from '../types';

export function useRealtimeSync() {
  const {
    metrics,
    setTimeframe,
    setCategory,
    addActivityEvent,
    addCollaborator,
  } = useDashboardStore();

  const handleRealtimeMessage = useCallback(
    (message: RealtimeMessage) => {
      const { type, senderName, payload } = message;

      switch (type) {
        case 'METRIC_UPDATED': {
          const { metricId, newValue, updatedMetric } = payload as {
            metricId: string;
            newValue: number;
            updatedMetric?: MetricItem;
          };

          // Update store directly without re-broadcasting to avoid infinite loop
          useDashboardStore.setState((state) => {
            const target = state.metrics.find((m) => m.id === metricId);
            if (!target) return state;

            const changePercent = Number(
              (((newValue - target.value) / (target.value || 1)) * 100).toFixed(1)
            );
            const formattedValue = target.prefix
              ? `${target.prefix}${newValue.toLocaleString()}`
              : target.suffix
              ? `${newValue.toLocaleString()}${target.suffix}`
              : newValue.toLocaleString();

            const newMetrics = state.metrics.map((m) =>
              m.id === metricId
                ? {
                    ...m,
                    value: newValue,
                    formattedValue,
                    changePercent: changePercent !== 0 ? changePercent : m.changePercent,
                    isPositive: changePercent >= 0,
                    lastUpdated: 'Just now',
                    updatedBy: senderName,
                  }
                : m
            );

            return { metrics: newMetrics };
          });

          addActivityEvent({
            userId: message.senderId,
            userName: senderName,
            userAvatar:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
            action: 'remotely updated metric',
            target: `${metricId} → ${newValue}`,
            type: 'metric_update',
          });
          break;
        }

        case 'FILTER_CHANGED': {
          const { timeframe, category } = payload as {
            timeframe?: Timeframe;
            category?: Category;
          };
          if (timeframe) setTimeframe(timeframe, false);
          if (category) setCategory(category, false);
          break;
        }

        case 'SIMULATED_ACTION': {
          const { action, target, user } = payload as {
            action: string;
            target: string;
            user: string;
          };
          addActivityEvent({
            userId: message.senderId,
            userName: user || senderName,
            userAvatar:
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            action,
            target,
            type: 'system_alert',
          });
          break;
        }

        default:
          break;
      }
    },
    [addActivityEvent, setTimeframe, setCategory]
  );

  useEffect(() => {
    // Subscribe to realtime channel & broadcast channel
    const unsubscribe = realtimeHub.subscribe(handleRealtimeMessage);

    // Announce local presence on mount
    realtimeHub.broadcast('PRESENCE_SYNC', {
      user: 'You (Local Tab)',
      status: 'online',
    });

    return () => {
      unsubscribe();
    };
  }, [handleRealtimeMessage]);

  // Utility method to simulate background live activity
  const triggerSimulatedCollaboratorAction = useCallback(
    (actionName: string, targetName: string, userName = 'Elena Rostova') => {
      realtimeHub.broadcast('SIMULATED_ACTION', {
        action: actionName,
        target: targetName,
        user: userName,
      });
    },
    []
  );

  return {
    triggerSimulatedCollaboratorAction,
    instanceId: realtimeHub.instanceId,
  };
}
