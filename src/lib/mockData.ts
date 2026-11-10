import {
  MetricItem,
  AnalyticsSeries,
  ChannelBreakdown,
  RegionalMetric,
  GridRow,
  UserPresence,
  ActivityEvent,
  Timeframe,
  Category,
  TransactionStatus,
} from '../types';

export const INITIAL_METRICS: MetricItem[] = [
  {
    id: 'm-revenue',
    title: 'Total Monthly Revenue',
    value: 128450,
    formattedValue: '$128,450',
    changePercent: 14.8,
    isPositive: true,
    unit: 'USD',
    prefix: '$',
    category: 'Enterprise',
    description: 'Gross recurring revenue across all customer tiers',
    lastUpdated: 'Just now',
    updatedBy: 'System Sync',
    historicalData: [
      { date: 'Mon', value: 112000 },
      { date: 'Tue', value: 115400 },
      { date: 'Wed', value: 119800 },
      { date: 'Thu', value: 122100 },
      { date: 'Fri', value: 125000 },
      { date: 'Sat', value: 126900 },
      { date: 'Sun', value: 128450 },
    ],
  },
  {
    id: 'm-active-users',
    title: 'Active Daily Users',
    value: 42910,
    formattedValue: '42,910',
    changePercent: 8.4,
    isPositive: true,
    unit: 'Users',
    category: 'SaaS',
    description: 'Unique active users logged in within 24 hours',
    lastUpdated: '1 min ago',
    updatedBy: 'Sarah Connor',
    historicalData: [
      { date: 'Mon', value: 38200 },
      { date: 'Tue', value: 39500 },
      { date: 'Wed', value: 40100 },
      { date: 'Thu', value: 41200 },
      { date: 'Fri', value: 42000 },
      { date: 'Sat', value: 42500 },
      { date: 'Sun', value: 42910 },
    ],
  },
  {
    id: 'm-conversion-rate',
    title: 'Checkout Conversion Rate',
    value: 4.82,
    formattedValue: '4.82%',
    changePercent: -1.2,
    isPositive: false,
    unit: '%',
    suffix: '%',
    category: 'E-commerce',
    description: 'Ratio of completed checkouts to checkout starts',
    lastUpdated: '3 mins ago',
    updatedBy: 'Alex Rivera',
    historicalData: [
      { date: 'Mon', value: 5.1 },
      { date: 'Tue', value: 5.0 },
      { date: 'Wed', value: 4.95 },
      { date: 'Thu', value: 4.88 },
      { date: 'Fri', value: 4.85 },
      { date: 'Sat', value: 4.8 },
      { date: 'Sun', value: 4.82 },
    ],
  },
  {
    id: 'm-avg-latency',
    title: 'Global P99 API Latency',
    value: 42,
    formattedValue: '42ms',
    changePercent: 12.5, // lower latency is better, but this indicates change magnitude
    isPositive: true,
    unit: 'ms',
    suffix: 'ms',
    category: 'Mobile',
    description: '99th percentile server response latency globally',
    lastUpdated: '5 mins ago',
    updatedBy: 'DevOps Sentinel',
    historicalData: [
      { date: 'Mon', value: 58 },
      { date: 'Tue', value: 52 },
      { date: 'Wed', value: 49 },
      { date: 'Thu', value: 46 },
      { date: 'Fri', value: 44 },
      { date: 'Sat', value: 43 },
      { date: 'Sun', value: 42 },
    ],
  },
];

export const MOCK_SERIES_7D: AnalyticsSeries[] = [
  { date: 'Aug 27', revenue: 16200, arr: 118000, activeUsers: 38500, conversionRate: 4.9, apiRequests: 1.25, latencyMs: 58, churnRate: 1.1 },
  { date: 'Aug 28', revenue: 17400, arr: 119500, activeUsers: 39100, conversionRate: 5.0, apiRequests: 1.32, latencyMs: 52, churnRate: 1.0 },
  { date: 'Aug 29', revenue: 18100, arr: 121000, activeUsers: 40200, conversionRate: 4.95, apiRequests: 1.41, latencyMs: 49, churnRate: 0.95 },
  { date: 'Aug 30', revenue: 17900, arr: 122400, activeUsers: 41000, conversionRate: 4.88, apiRequests: 1.38, latencyMs: 46, churnRate: 0.98 },
  { date: 'Aug 31', revenue: 19300, arr: 124800, activeUsers: 41800, conversionRate: 4.85, apiRequests: 1.49, latencyMs: 44, churnRate: 0.92 },
  { date: 'Sep 01', revenue: 18800, arr: 126200, activeUsers: 42300, conversionRate: 4.81, apiRequests: 1.52, latencyMs: 43, churnRate: 0.91 },
  { date: 'Sep 02', revenue: 20750, arr: 128450, activeUsers: 42910, conversionRate: 4.82, apiRequests: 1.60, latencyMs: 42, churnRate: 0.89 },
];

export const MOCK_SERIES_30D: AnalyticsSeries[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 4; // Aug 4 - Sep 2
  const month = day > 31 ? 'Sep' : 'Aug';
  const dateNum = day > 31 ? day - 31 : day;
  const formattedDate = `${month} ${dateNum < 10 ? '0' + dateNum : dateNum}`;
  const baseRev = 12000 + i * 280 + Math.sin(i) * 1200;
  return {
    date: formattedDate,
    revenue: Math.round(baseRev),
    arr: Math.round(100000 + i * 950),
    activeUsers: Math.round(30000 + i * 430 + Math.cos(i) * 800),
    conversionRate: Number((4.2 + Math.sin(i * 0.5) * 0.7).toFixed(2)),
    apiRequests: Number((0.9 + i * 0.024).toFixed(2)),
    latencyMs: Math.round(65 - i * 0.7 + (i % 3 === 0 ? 4 : -2)),
    churnRate: Number((1.4 - i * 0.015).toFixed(2)),
  };
});

export const MOCK_SERIES_1Y: AnalyticsSeries[] = [
  { date: 'Oct 2025', revenue: 82000, arr: 984000, activeUsers: 24000, conversionRate: 3.8, apiRequests: 0.75, latencyMs: 82, churnRate: 1.8 },
  { date: 'Nov 2025', revenue: 88500, arr: 1062000, activeUsers: 26500, conversionRate: 4.0, apiRequests: 0.82, latencyMs: 78, churnRate: 1.65 },
  { date: 'Dec 2025', revenue: 94000, arr: 1128000, activeUsers: 29000, conversionRate: 4.3, apiRequests: 0.91, latencyMs: 74, churnRate: 1.5 },
  { date: 'Jan 2026', revenue: 99200, arr: 1190400, activeUsers: 31200, conversionRate: 4.2, apiRequests: 0.98, latencyMs: 70, churnRate: 1.4 },
  { date: 'Feb 2026', revenue: 104500, arr: 1254000, activeUsers: 33400, conversionRate: 4.4, apiRequests: 1.05, latencyMs: 65, churnRate: 1.3 },
  { date: 'Mar 2026', revenue: 110200, arr: 1322400, activeUsers: 35800, conversionRate: 4.5, apiRequests: 1.15, latencyMs: 61, churnRate: 1.2 },
  { date: 'Apr 2026', revenue: 114800, arr: 1377600, activeUsers: 37200, conversionRate: 4.6, apiRequests: 1.22, latencyMs: 56, churnRate: 1.15 },
  { date: 'May 2026', revenue: 119500, arr: 1434000, activeUsers: 38900, conversionRate: 4.7, apiRequests: 1.31, latencyMs: 51, churnRate: 1.05 },
  { date: 'Jun 2026', revenue: 122000, arr: 1464000, activeUsers: 40100, conversionRate: 4.65, apiRequests: 1.40, latencyMs: 48, churnRate: 1.0 },
  { date: 'Jul 2026', revenue: 124800, arr: 1497600, activeUsers: 41200, conversionRate: 4.75, apiRequests: 1.48, latencyMs: 45, churnRate: 0.95 },
  { date: 'Aug 2026', revenue: 126900, arr: 1522800, activeUsers: 42100, conversionRate: 4.80, apiRequests: 1.55, latencyMs: 43, churnRate: 0.91 },
  { date: 'Sep 2026', revenue: 128450, arr: 1541400, activeUsers: 42910, conversionRate: 4.82, apiRequests: 1.60, latencyMs: 42, churnRate: 0.89 },
];

export const MOCK_CHANNELS: ChannelBreakdown[] = [
  { name: 'Direct Enterprise', value: 58400, percentage: 45.4, color: '#6366F1', growth: 18.2 },
  { name: 'Organic Search', value: 32100, percentage: 25.0, color: '#06B6D4', growth: 12.4 },
  { name: 'Partner Referrals', value: 21800, percentage: 17.0, color: '#10B981', growth: 22.8 },
  { name: 'Paid Campaigns', value: 16150, percentage: 12.6, color: '#F59E0B', growth: -3.5 },
];

export const MOCK_REGIONS: RegionalMetric[] = [
  { region: 'North America (US-East)', revenue: 64200, transactions: 1420, share: 50.0 },
  { region: 'Europe (EU-Central)', revenue: 38500, transactions: 890, share: 30.0 },
  { region: 'Asia-Pacific (APAC-SG)', revenue: 19200, transactions: 440, share: 15.0 },
  { region: 'Latin America (LATAM)', revenue: 6550, transactions: 160, share: 5.0 },
];

export const INITIAL_COLLABORATORS: UserPresence[] = [
  {
    id: 'u-1',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    role: 'Lead Engineer',
    status: 'online',
    activeSection: 'Analytics Charts',
    lastActive: 'Just now',
    color: '#6366F1',
  },
  {
    id: 'u-2',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    role: 'Data Scientist',
    status: 'editing',
    activeSection: 'KPI Revenue Card',
    lastActive: '1 min ago',
    color: '#06B6D4',
  },
  {
    id: 'u-3',
    name: 'Sophia Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'Product Manager',
    status: 'online',
    activeSection: 'Enterprise Grid',
    lastActive: '3 mins ago',
    color: '#10B981',
  },
  {
    id: 'u-4',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    role: 'Analyst',
    status: 'idle',
    activeSection: 'Command Palette',
    lastActive: '8 mins ago',
    color: '#F59E0B',
  },
];

const NAMES = [
  'Acme Tech', 'Nexus Dynamics', 'Starlight Labs', 'Apex Systems',
  'Vortex Media', 'Cyberdyne Global', 'Hyperion Software', 'Zenith Logistics',
  'Solstice Retail', 'Omni Corp', 'Quantum FinTech', 'Aether Networks',
  'Pulse Health', 'Horizon AI', 'Titan Mobility', 'Veritas Bio',
  'Atlas Energy', 'Chronos Cloud', 'Spectra Security', 'Nova Pay'
];

const CATEGORIES: Category[] = ['SaaS', 'E-commerce', 'Enterprise', 'Mobile'];
const REGIONS = ['US-East (N. Virginia)', 'US-West (Oregon)', 'EU-Central (Frankfurt)', 'AP-East (Tokyo)', 'SA-East (São Paulo)'];
const PLANS = ['Starter', 'Pro', 'Enterprise', 'Ultimate'] as const;
const STATUSES: TransactionStatus[] = ['Completed', 'Pending', 'Failed', 'Refunded'];

export const GENERATE_GRID_DATA = (): GridRow[] => {
  const rows: GridRow[] = [];
  const avatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
  ];

  for (let i = 1; i <= 64; i++) {
    const nameIndex = (i - 1) % NAMES.length;
    const compName = `${NAMES[nameIndex]} #${Math.floor(i / NAMES.length) + 1}`;
    const category = CATEGORIES[i % CATEGORIES.length];
    const status = STATUSES[(i * 3 + 1) % STATUSES.length];
    const plan = PLANS[i % PLANS.length];
    const amount = Math.round(150 + (i * 87) % 4800 + Math.random() * 20);
    const region = REGIONS[i % REGIONS.length];
    const dateObj = new Date(Date.now() - (64 - i) * 3600 * 1000 * 4);

    rows.push({
      id: `row-${i}`,
      transactionId: `TXN-${99000 + i}`,
      customerName: compName,
      customerEmail: `billing@${compName.toLowerCase().replace(/[^a-z0-9]/g, '')}.io`,
      avatar: avatars[i % avatars.length],
      category,
      amount,
      status,
      region,
      timestamp: dateObj.toISOString(),
      latency: Math.round(25 + (i * 7) % 45),
      plan,
    });
  }
  return rows;
};

export const INITIAL_ACTIVITY_LOG: ActivityEvent[] = [
  {
    id: 'act-1',
    userId: 'u-1',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    action: 'updated timeframe',
    target: '30 Days View',
    timestamp: '2 mins ago',
    type: 'filter_change',
  },
  {
    id: 'act-2',
    userId: 'u-2',
    userName: 'Marcus Vance',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    action: 'modified metric',
    target: 'Total Monthly Revenue ($128,450)',
    timestamp: '4 mins ago',
    type: 'metric_update',
  },
  {
    id: 'act-3',
    userId: 'u-3',
    userName: 'Sophia Chen',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    action: 'exported dataset',
    target: 'Transactions CSV Export (64 records)',
    timestamp: '8 mins ago',
    type: 'export',
  },
  {
    id: 'act-4',
    userId: 'u-4',
    userName: 'David Kim',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    action: 'applied filter tag',
    target: 'Enterprise Category',
    timestamp: '12 mins ago',
    type: 'filter_change',
  },
];
