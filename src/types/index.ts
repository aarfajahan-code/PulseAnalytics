export type Timeframe = '7d' | '30d' | '1y';

export type Category = 'All' | 'SaaS' | 'E-commerce' | 'Enterprise' | 'Mobile';

export type UserRole = 'Admin' | 'Lead Engineer' | 'Data Scientist' | 'Product Manager' | 'Analyst';

export interface UserPresence {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  status: 'online' | 'idle' | 'editing';
  activeSection?: string;
  lastActive: string;
  color: string;
}

export interface MetricItem {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  changePercent: number;
  isPositive: boolean;
  unit: string;
  prefix?: string;
  suffix?: string;
  category: Category;
  description: string;
  lastUpdated: string;
  updatedBy?: string;
  historicalData: { date: string; value: number }[];
}

export interface AnalyticsSeries {
  date: string;
  revenue: number;
  arr: number;
  activeUsers: number;
  conversionRate: number;
  apiRequests: number;
  latencyMs: number;
  churnRate: number;
}

export interface ChannelBreakdown {
  name: string;
  value: number;
  percentage: number;
  color: string;
  growth: number;
}

export interface RegionalMetric {
  region: string;
  revenue: number;
  transactions: number;
  share: number;
}

export type TransactionStatus = 'Completed' | 'Pending' | 'Failed' | 'Refunded';

export interface GridRow {
  id: string;
  transactionId: string;
  customerName: string;
  customerEmail: string;
  avatar: string;
  category: Category;
  amount: number;
  status: TransactionStatus;
  region: string;
  timestamp: string;
  latency: number;
  plan: 'Starter' | 'Pro' | 'Enterprise' | 'Ultimate';
}

export interface ActivityEvent {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'metric_update' | 'filter_change' | 'export' | 'layout_change' | 'presence_join' | 'system_alert';
  details?: Record<string, unknown>;
}

export interface FilterState {
  searchQuery: string;
  category: Category;
  timeframe: Timeframe;
  statusFilter: TransactionStatus | 'All';
  dateRange: { start: string | null; end: string | null };
}

export type ThemeMode = 'dark' | 'light';

export interface RealtimeMessage<T = unknown> {
  type: 'METRIC_UPDATED' | 'FILTER_CHANGED' | 'PRESENCE_SYNC' | 'ACTIVITY_LOGGED' | 'SIMULATED_ACTION';
  senderId: string;
  senderName: string;
  timestamp: string;
  payload: T;
}
