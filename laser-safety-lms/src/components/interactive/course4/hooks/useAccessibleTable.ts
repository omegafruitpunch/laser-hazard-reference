"use client";

import { useState, useCallback, useRef, KeyboardEvent, useEffect } from "react";
import { useAccessibilitySettings } from "@/hooks/useAccessibilitySettings";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  width?: string;
}

export interface UseAccessibleTableOptions<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  defaultSortColumn?: string;
  defaultSortDirection?: "asc" | "desc";
  pageSize?: number;
  onRowSelect?: (selectedRows: T[]) => void;
  selectable?: boolean;
}

export interface UseAccessibleTableReturn<T> {
  // Data
  sortedData: T[];
  paginatedData: T[];
  selectedRows: Set<string>;
  
  // Sorting
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  handleSort: (columnKey: string) => void;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  
  // Selection
  toggleRowSelection: (rowKey: string) => void;
  toggleAllSelection: () => void;
  isRowSelected: (rowKey: string) => boolean;
  areAllSelected: boolean;
  
  // Keyboard navigation
  focusedRowIndex: number;
  focusedCellIndex: number;
  tableRef: React.RefObject<HTMLTableElement | null>;
  handleTableKeyDown: (event: KeyboardEvent<HTMLTableElement>) => void;
  focusCell: (rowIndex: number, cellIndex: number) => void;
  
  // ARIA
  getTableAriaAttributes: () => Record<string, string | boolean | number | undefined>;
  getRowAriaAttributes: (rowIndex: number, rowKey: string) => Record<string, string | boolean | number | undefined>;
  getCellAriaAttributes: (rowIndex: number, cellIndex: number) => Record<string, string | number | undefined>;
  getSortButtonAriaAttributes: (columnKey: string) => Record<string, string | boolean | number | undefined>;
}

/**
 * Hook for accessible data tables with keyboard navigation
 * WCAG 2.2 AA compliant - supports screen readers and keyboard users
 */
export function useAccessibleTable<T>(
  options: UseAccessibleTableOptions<T>
): UseAccessibleTableReturn<T> {
  const {
    data,
    columns,
    keyExtractor,
    defaultSortColumn,
    defaultSortDirection = "asc",
    pageSize = 10,
    onRowSelect,
    selectable = true,
  } = options;

  const { announceToScreenReader } = useAccessibilitySettings();
  const tableRef = useRef<HTMLTableElement>(null);

  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(defaultSortColumn || null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(defaultSortDirection);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);

  // Selection state
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Keyboard navigation state
  const [focusedRowIndex, setFocusedRowIndex] = useState(-1);
  const [focusedCellIndex, setFocusedCellIndex] = useState(-1);

  // Sort data
  const sortedData = useCallback(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortColumn];
      const bValue = (b as Record<string, unknown>)[sortColumn];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = String(aValue).localeCompare(String(bValue));
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection])();

  // Paginate data
  const paginatedData = sortedData.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sort
  const handleSort = useCallback(
    (columnKey: string) => {
      if (sortColumn === columnKey) {
        const newDirection = sortDirection === "asc" ? "desc" : "asc";
        setSortDirection(newDirection);
        announceToScreenReader(`Sorted by ${columnKey}, ${newDirection}ending`, "polite");
      } else {
        setSortColumn(columnKey);
        setSortDirection("asc");
        announceToScreenReader(`Sorted by ${columnKey}, ascending`, "polite");
      }
      setCurrentPage(0);
    },
    [sortColumn, sortDirection, announceToScreenReader]
  );

  // Pagination handlers
  const goToPage = useCallback(
    (page: number) => {
      const clampedPage = Math.max(0, Math.min(page, totalPages - 1));
      setCurrentPage(clampedPage);
      announceToScreenReader(`Page ${clampedPage + 1} of ${totalPages}`, "polite");
    },
    [totalPages, announceToScreenReader]
  );

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  // Selection handlers
  const toggleRowSelection = useCallback(
    (rowKey: string) => {
      setSelectedRows((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(rowKey)) {
          newSet.delete(rowKey);
          announceToScreenReader("Row deselected", "polite");
        } else {
          newSet.add(rowKey);
          announceToScreenReader("Row selected", "polite");
        }
        
        const selectedData = data.filter((item) => newSet.has(keyExtractor(item)));
        onRowSelect?.(selectedData);
        
        return newSet;
      });
    },
    [data, keyExtractor, onRowSelect, announceToScreenReader]
  );

  const toggleAllSelection = useCallback(() => {
    if (selectedRows.size === paginatedData.length && paginatedData.length > 0) {
      setSelectedRows(new Set());
      onRowSelect?.([]);
      announceToScreenReader("All rows deselected", "polite");
    } else {
      const allKeys = new Set(paginatedData.map((item) => keyExtractor(item)));
      setSelectedRows(allKeys);
      onRowSelect?.(paginatedData);
      announceToScreenReader(`All ${paginatedData.length} rows selected`, "polite");
    }
  }, [paginatedData, selectedRows.size, keyExtractor, onRowSelect, announceToScreenReader]);

  const isRowSelected = useCallback(
    (rowKey: string) => selectedRows.has(rowKey),
    [selectedRows]
  );

  const areAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedRows.has(keyExtractor(item)));

  // Focus management
  const focusCell = useCallback(
    (rowIndex: number, cellIndex: number) => {
      const clampedRow = Math.max(0, Math.min(rowIndex, paginatedData.length - 1));
      const clampedCell = Math.max(0, Math.min(cellIndex, columns.length - 1));
      
      setFocusedRowIndex(clampedRow);
      setFocusedCellIndex(clampedCell);

      const cell = tableRef.current?.querySelector(
        `[data-row="${clampedRow}"][data-cell="${clampedCell}"]`
      ) as HTMLElement;
      cell?.focus();
    },
    [paginatedData.length, columns.length]
  );

  // Keyboard navigation
  const handleTableKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTableElement>) => {
      const { key, ctrlKey } = event;

      switch (key) {
        case "ArrowRight":
          event.preventDefault();
          focusCell(focusedRowIndex, focusedCellIndex + 1);
          break;

        case "ArrowLeft":
          event.preventDefault();
          focusCell(focusedRowIndex, focusedCellIndex - 1);
          break;

        case "ArrowDown":
          event.preventDefault();
          if (focusedRowIndex === paginatedData.length - 1 && currentPage < totalPages - 1) {
            goToNextPage();
            focusCell(0, focusedCellIndex);
          } else {
            focusCell(focusedRowIndex + 1, focusedCellIndex);
          }
          break;

        case "ArrowUp":
          event.preventDefault();
          if (focusedRowIndex === 0 && currentPage > 0) {
            goToPreviousPage();
            setTimeout(() => focusCell(paginatedData.length - 1, focusedCellIndex), 0);
          } else {
            focusCell(focusedRowIndex - 1, focusedCellIndex);
          }
          break;

        case "Home":
          event.preventDefault();
          if (ctrlKey) {
            goToPage(0);
            focusCell(0, 0);
          } else {
            focusCell(focusedRowIndex, 0);
          }
          break;

        case "End":
          event.preventDefault();
          if (ctrlKey) {
            goToPage(totalPages - 1);
            setTimeout(() => focusCell(paginatedData.length - 1, columns.length - 1), 0);
          } else {
            focusCell(focusedRowIndex, columns.length - 1);
          }
          break;

        case "PageDown":
          event.preventDefault();
          goToNextPage();
          break;

        case "PageUp":
          event.preventDefault();
          goToPreviousPage();
          break;

        case " ":
          if (selectable && focusedRowIndex >= 0) {
            event.preventDefault();
            const rowData = paginatedData[focusedRowIndex];
            if (rowData) {
              toggleRowSelection(keyExtractor(rowData));
            }
          }
          break;

        case "Escape":
          event.preventDefault();
          setFocusedRowIndex(-1);
          setFocusedCellIndex(-1);
          tableRef.current?.blur();
          break;
      }
    },
    [
      focusedRowIndex,
      focusedCellIndex,
      paginatedData,
      currentPage,
      totalPages,
      columns.length,
      selectable,
      keyExtractor,
      focusCell,
      goToNextPage,
      goToPreviousPage,
      goToPage,
      toggleRowSelection,
    ]
  );

  // ARIA attributes
  const getTableAriaAttributes = useCallback(() => {
    return {
      role: "grid",
      "aria-rowcount": data.length,
      "aria-colcount": columns.length,
      "aria-label": "Data table with keyboard navigation. Use arrow keys to navigate, Space to select.",
      tabIndex: 0,
    };
  }, [data.length, columns.length]);

  const getRowAriaAttributes = useCallback(
    (rowIndex: number, rowKey: string) => {
      return {
        role: "row",
        "aria-rowindex": rowIndex + 1 + currentPage * pageSize,
        "aria-selected": selectable ? isRowSelected(rowKey) : undefined,
        "data-row": rowIndex,
      };
    },
    [currentPage, pageSize, selectable, isRowSelected]
  );

  const getCellAriaAttributes = useCallback(
    (rowIndex: number, cellIndex: number) => {
      return {
        role: "gridcell",
        tabIndex: rowIndex === focusedRowIndex && cellIndex === focusedCellIndex ? 0 : -1,
        "data-row": rowIndex,
        "data-cell": cellIndex,
        "aria-colindex": cellIndex + 1,
      };
    },
    [focusedRowIndex, focusedCellIndex]
  );

  const getSortButtonAriaAttributes = useCallback(
    (columnKey: string) => {
      const isSorted = sortColumn === columnKey;
      return {
        "aria-sort": isSorted ? (sortDirection === "asc" ? "ascending" : "descending") : "none",
        "aria-label": `Sort by ${columnKey}${isSorted ? `, currently ${sortDirection}ending` : ""}`,
      };
    },
    [sortColumn, sortDirection]
  );

  // Reset focused index when page changes
  useEffect(() => {
    setFocusedRowIndex(-1);
    setFocusedCellIndex(-1);
  }, [currentPage]);

  return {
    sortedData,
    paginatedData,
    selectedRows,
    sortColumn,
    sortDirection,
    handleSort,
    currentPage,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    toggleRowSelection,
    toggleAllSelection,
    isRowSelected,
    areAllSelected,
    focusedRowIndex,
    focusedCellIndex,
    tableRef,
    handleTableKeyDown,
    focusCell,
    getTableAriaAttributes,
    getRowAriaAttributes,
    getCellAriaAttributes,
    getSortButtonAriaAttributes,
  };
}

export default useAccessibleTable;
