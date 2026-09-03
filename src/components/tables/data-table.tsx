"use client";

import { ReactNode, useState, useMemo } from "react";
import { LucideIcon, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  filterKey?: keyof T;
  filterOptions?: { label: string; value: string }[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  pageSize?: number;
  actions?: (item: T) => ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search records...",
  filterKey,
  filterOptions,
  isLoading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no entries matching your current view criteria.",
  emptyIcon,
  pageSize = 6,
  actions,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & Search
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search filter
      const matchesSearch = searchKey
        ? String(item[searchKey] || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true;

      // Dropdown filter
      const matchesFilter =
        filterKey && filterValue !== "ALL"
          ? String(item[filterKey]) === filterValue
          : true;

      return matchesSearch && matchesFilter;
    });
  }, [data, searchKey, searchTerm, filterKey, filterValue]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  if (isLoading) {
    return <TableSkeleton rows={pageSize} />;
  }

  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden transition-all">
      {/* Table Toolbar */}
      {(searchKey || filterKey) && (
        <div className="border-b border-border p-4 bg-surface-muted/50 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          {searchKey ? (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-border bg-surface pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
              />
            </div>
          ) : null}

          {filterKey && filterOptions ? (
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-text-muted shrink-0" />
              <select
                value={filterValue}
                onChange={(e) => {
                  setFilterValue(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary focus:border-brand outline-none transition-colors cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                {filterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
      )}

      {/* Main Table */}
      {filteredData.length === 0 ? (
        <div className="p-8 text-center">
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            icon={emptyIcon}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-primary">
            <thead className="border-b border-border bg-surface-muted/80 text-xs uppercase font-semibold text-text-muted tracking-wider">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={`px-6 py-3.5 ${
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left"
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
                {actions ? (
                  <th className="px-6 py-3.5 text-right">Actions</th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="hover:bg-surface-muted/40 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-6 py-4 font-normal text-text-secondary ${
                        col.align === "right"
                          ? "text-right"
                          : col.align === "center"
                          ? "text-center"
                          : "text-left"
                      }`}
                    >
                      {col.render ? col.render(row) : String(row[col.key] ?? "-")}
                    </td>
                  ))}
                  {actions ? (
                    <td className="px-6 py-4 text-right">{actions(row)}</td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {filteredData.length > 0 && (
        <div className="border-t border-border p-4 bg-surface flex items-center justify-between text-xs text-text-muted">
          <span>
            Showing{" "}
            <strong className="font-semibold text-text-primary">
              {(currentPage - 1) * pageSize + 1}
            </strong>{" "}
            to{" "}
            <strong className="font-semibold text-text-primary">
              {Math.min(currentPage * pageSize, filteredData.length)}
            </strong>{" "}
            of{" "}
            <strong className="font-semibold text-text-primary">
              {filteredData.length}
            </strong>{" "}
            entries
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center space-x-1 rounded-md border border-border px-3 py-1.5 font-medium text-text-secondary hover:bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <span className="px-2 font-medium text-text-primary">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center space-x-1 rounded-md border border-border px-3 py-1.5 font-medium text-text-secondary hover:bg-surface-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
