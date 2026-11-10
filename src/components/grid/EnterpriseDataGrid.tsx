import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  flexRender,
} from '@tanstack/react-table';
import {
  useGridDataQuery,
  useUpdateGridRowMutation,
} from '../../hooks/useDashboardData';
import { useDashboardStore } from '../../store/useDashboardStore';
import { GridRow, TransactionStatus } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileJson,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { clsx } from 'clsx';

export const EnterpriseDataGrid: React.FC = () => {
  const { searchQuery, category, statusFilter, columnVisibility, toggleColumnVisibility, addActivityEvent } =
    useDashboardStore();

  const { data: gridData = [], isLoading } = useGridDataQuery(
    searchQuery,
    category,
    statusFilter
  );

  const updateRowMutation = useUpdateGridRowMutation();
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'timestamp', desc: true },
  ]);
  const [columnVisibilityMenuOpen, setColumnVisibilityMenuOpen] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>({});

  // Column Definition
  const columns = useMemo<ColumnDef<GridRow>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'transactionId',
        header: 'ID',
        cell: (info) => (
          <span className="font-mono text-xs font-bold text-indigo-400">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: 'customerName',
        header: 'Customer Organization',
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex items-center gap-2.5">
              <img
                src={row.avatar}
                alt={row.customerName}
                className="w-7 h-7 rounded-full border border-slate-700 object-cover"
              />
              <div>
                <p className="font-semibold text-xs text-slate-100">{row.customerName}</p>
                <p className="text-[10px] text-slate-400 font-mono">{row.customerEmail}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: (info) => <Badge variant="slate">{info.getValue() as string}</Badge>,
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: (info) => (
          <span className="font-mono font-extrabold text-xs text-slate-100">
            ${(info.getValue() as number).toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue() as TransactionStatus;
          const row = info.row.original;

          const getStatusBadge = () => {
            switch (status) {
              case 'Completed':
                return (
                  <Badge variant="emerald" size="sm" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Completed
                  </Badge>
                );
              case 'Pending':
                return (
                  <Badge variant="amber" size="sm" className="gap-1">
                    <Clock className="w-3 h-3 animate-spin-slow" /> Pending
                  </Badge>
                );
              case 'Failed':
                return (
                  <Badge variant="rose" size="sm" className="gap-1">
                    <AlertTriangle className="w-3 h-3" /> Failed
                  </Badge>
                );
              case 'Refunded':
                return (
                  <Badge variant="cyan" size="sm" className="gap-1">
                    <RotateCcw className="w-3 h-3" /> Refunded
                  </Badge>
                );
            }
          };

          return (
            <div className="group relative inline-block">
              {getStatusBadge()}
              {/* Quick Status Change Dropdown on Hover/Click */}
              <select
                value={status}
                onChange={(e) => {
                  updateRowMutation.mutate({
                    id: row.id,
                    status: e.target.value as TransactionStatus,
                  });
                }}
                className="absolute inset-0 opacity-0 cursor-pointer text-xs"
                title="Click to update status inline"
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          );
        },
      },
      {
        accessorKey: 'region',
        header: 'Cluster Region',
        cell: (info) => (
          <span className="text-xs text-slate-300 font-mono">{info.getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'latency',
        header: 'Latency',
        cell: (info) => {
          const lat = info.getValue() as number;
          return (
            <span
              className={clsx(
                'font-mono text-xs font-semibold',
                lat < 35 ? 'text-emerald-400' : lat < 50 ? 'text-amber-400' : 'text-rose-400'
              )}
            >
              {lat}ms
            </span>
          );
        },
      },
      {
        accessorKey: 'plan',
        header: 'Tier Plan',
        cell: (info) => <Badge variant="indigo">{info.getValue() as string}</Badge>,
      },
      {
        accessorKey: 'timestamp',
        header: 'Timestamp',
        cell: (info) => (
          <span className="text-[11px] text-slate-400 font-mono">
            {new Date(info.getValue() as string).toLocaleString()}
          </span>
        ),
      },
    ],
    [updateRowMutation]
  );

  const table = useReactTable({
    data: gridData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection: selectedRowIds,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setSelectedRowIds,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Export to CSV Handler
  const exportCSV = () => {
    if (!gridData.length) return;
    const headers = ['Transaction ID', 'Customer', 'Email', 'Category', 'Amount', 'Status', 'Region', 'Latency ms', 'Plan', 'Timestamp'];
    const csvRows = [
      headers.join(','),
      ...gridData.map((row) =>
        [
          `"${row.transactionId}"`,
          `"${row.customerName}"`,
          `"${row.customerEmail}"`,
          `"${row.category}"`,
          row.amount,
          `"${row.status}"`,
          `"${row.region}"`,
          row.latency,
          `"${row.plan}"`,
          `"${row.timestamp}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pulse_analytics_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addActivityEvent({
      userId: 'current-user',
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      action: 'exported CSV data grid',
      target: `${gridData.length} Records`,
      type: 'export',
    });
  };

  // Export to JSON Handler
  const exportJSON = () => {
    if (!gridData.length) return;
    const jsonStr = JSON.stringify(gridData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pulse_analytics_transactions_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addActivityEvent({
      userId: 'current-user',
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      action: 'exported JSON dataset',
      target: `${gridData.length} Records`,
      type: 'export',
    });
  };

  return (
    <Card glass className="p-6 space-y-4">
      {/* Grid Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold tracking-tight">Enterprise Transaction Grid</h3>
            <Badge variant="indigo" size="sm">
              {gridData.length} Records
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            High-density data table supporting multi-column sorting (Shift+Click), column toggles, and live export.
          </p>
        </div>

        {/* Action Controls: Column Toggles, Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Column Visibility Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setColumnVisibilityMenuOpen(!columnVisibilityMenuOpen)}
              leftIcon={<Eye className="w-3.5 h-3.5" />}
              rightIcon={<ChevronDown className="w-3.5 h-3.5" />}
            >
              Columns
            </Button>
            {columnVisibilityMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-30 space-y-1">
                <p className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-800">
                  Toggle Columns
                </p>
                {table.getAllLeafColumns().map((col) => {
                  if (col.id === 'select') return null;
                  return (
                    <label
                      key={col.id}
                      className="flex items-center gap-2 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800 rounded-lg cursor-pointer capitalize"
                    >
                      <input
                        type="checkbox"
                        checked={col.getIsVisible()}
                        onChange={() => toggleColumnVisibility(col.id)}
                        className="rounded border-slate-700 bg-slate-950 text-indigo-600"
                      />
                      <span>{col.id}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Export CSV */}
          <Button
            variant="secondary"
            size="sm"
            onClick={exportCSV}
            leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />}
          >
            Export CSV
          </Button>

          {/* Export JSON */}
          <Button
            variant="secondary"
            size="sm"
            onClick={exportJSON}
            leftIcon={<FileJson className="w-3.5 h-3.5 text-cyan-400" />}
          >
            JSON
          </Button>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 select-none">
                    {header.isPlaceholder ? null : (
                      <div
                        className={clsx(
                          'flex items-center gap-1.5',
                          header.column.getCanSort() && 'cursor-pointer hover:text-white transition-colors'
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <ArrowUpDown className="w-3 h-3 text-slate-500" />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-slate-400 font-mono">
                  Loading enterprise data grid...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-slate-400">
                  No records match current filter criteria.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-800/40 transition-colors duration-150 group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-slate-200">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</strong> to{' '}
            <strong className="text-slate-200">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                gridData.length
              )}
            </strong>{' '}
            of <strong className="text-slate-200">{gridData.length}</strong> results
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
          >
            {[10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} / page
              </option>
            ))}
          </select>
        </div>

        {/* Page navigation buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="px-3 font-mono font-semibold text-slate-200">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-1.5"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
