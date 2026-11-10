import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MOCK_SERIES_7D,
  MOCK_SERIES_30D,
  MOCK_SERIES_1Y,
  MOCK_CHANNELS,
  MOCK_REGIONS,
  GENERATE_GRID_DATA,
} from '../lib/mockData';
import { Timeframe, Category, TransactionStatus, GridRow } from '../types';
import { useDashboardStore } from '../store/useDashboardStore';

// Simulated API fetching delays for realistic loading skeletons & caching
const fetchAnalyticsSeries = async (timeframe: Timeframe) => {
  await new Promise((resolve) => setTimeout(resolve, 350));
  switch (timeframe) {
    case '7d':
      return MOCK_SERIES_7D;
    case '30d':
      return MOCK_SERIES_30D;
    case '1y':
      return MOCK_SERIES_1Y;
    default:
      return MOCK_SERIES_7D;
  }
};

const fetchChannelBreakdown = async () => {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return MOCK_CHANNELS;
};

const fetchRegionalMetrics = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_REGIONS;
};

// Initial grid dataset reference
let gridCache: GridRow[] = [];

const fetchGridData = async (): Promise<GridRow[]> => {
  if (gridCache.length === 0) {
    gridCache = GENERATE_GRID_DATA();
  }
  await new Promise((resolve) => setTimeout(resolve, 400));
  return gridCache;
};

export const useAnalyticsSeriesQuery = (timeframe: Timeframe) => {
  return useQuery({
    queryKey: ['analytics-series', timeframe],
    queryFn: () => fetchAnalyticsSeries(timeframe),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export const useChannelsQuery = () => {
  return useQuery({
    queryKey: ['channel-breakdown'],
    queryFn: fetchChannelBreakdown,
    staleTime: 1000 * 60 * 10,
  });
};

export const useRegionalMetricsQuery = () => {
  return useQuery({
    queryKey: ['regional-metrics'],
    queryFn: fetchRegionalMetrics,
    staleTime: 1000 * 60 * 10,
  });
};

export const useGridDataQuery = (
  searchQuery: string,
  category: Category,
  statusFilter: TransactionStatus | 'All'
) => {
  return useQuery({
    queryKey: ['grid-transactions'],
    queryFn: fetchGridData,
    select: (data) => {
      let filtered = data;

      if (category !== 'All') {
        filtered = filtered.filter((item) => item.category === category);
      }

      if (statusFilter !== 'All') {
        filtered = filtered.filter((item) => item.status === statusFilter);
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.customerName.toLowerCase().includes(query) ||
            item.customerEmail.toLowerCase().includes(query) ||
            item.transactionId.toLowerCase().includes(query) ||
            item.region.toLowerCase().includes(query) ||
            item.plan.toLowerCase().includes(query)
        );
      }

      return filtered;
    },
    staleTime: 1000 * 60 * 2,
  });
};

export const useUpdateGridRowMutation = () => {
  const queryClient = useQueryClient();
  const addActivityEvent = useDashboardStore((s) => s.addActivityEvent);

  return useMutation({
    mutationFn: async (updatedRow: Partial<GridRow> & { id: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      gridCache = gridCache.map((row) =>
        row.id === updatedRow.id ? { ...row, ...updatedRow } : row
      );
      return updatedRow;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<GridRow[]>(['grid-transactions'], (old) =>
        old ? old.map((r) => (r.id === data.id ? { ...r, ...data } : r)) : []
      );
      addActivityEvent({
        userId: 'current-user',
        userName: 'You',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        action: 'updated transaction status',
        target: `${data.id} → ${data.status || 'modified'}`,
        type: 'metric_update',
      });
    },
  });
};
