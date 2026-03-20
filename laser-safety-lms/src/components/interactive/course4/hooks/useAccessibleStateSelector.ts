"use client";

import { useState, useCallback, useRef, useEffect, KeyboardEvent } from "react";
import { useAccessibilitySettings } from "@/hooks/useAccessibilitySettings";

export interface UseAccessibleStateSelectorOptions {
  states: { id: string; name: string; abbreviation?: string }[];
  defaultSelected?: string[];
  maxSelections?: number;
  onSelectionChange?: (selected: string[]) => void;
}

export interface UseAccessibleStateSelectorReturn {
  selectedStates: string[];
  focusedIndex: number;
  searchQuery: string;
  listboxRef: React.RefObject<HTMLDivElement | null>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  filteredStates: { id: string; name: string; abbreviation?: string }[];
  toggleState: (stateId: string) => void;
  selectAll: () => void;
  clearAll: () => void;
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  handleSearchKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  setSearchQuery: (query: string) => void;
  focusStateAtIndex: (index: number) => void;
  announceSelection: (stateName: string, selected: boolean) => void;
  getAriaAttributes: () => Record<string, string | boolean | number | undefined>;
  getStateAriaAttributes: (stateId: string, index: number) => Record<string, string | boolean | number>;
}

/**
 * Hook for accessible state selector with full keyboard navigation
 * WCAG 2.2 AA compliant - supports screen readers and keyboard users
 */
export function useAccessibleStateSelector(
  options: UseAccessibleStateSelectorOptions
): UseAccessibleStateSelectorReturn {
  const { states, defaultSelected = [], maxSelections, onSelectionChange } = options;
  const { announceToScreenReader } = useAccessibilitySettings();
  
  const [selectedStates, setSelectedStates] = useState<string[]>(defaultSelected);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [searchQuery, setSearchQuery] = useState("");
  
  const listboxRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const stateId = useRef(`state-selector-${Math.random().toString(36).substr(2, 9)}`);

  // Filter states based on search query
  const filteredStates = states.filter(
    (state) =>
      state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.abbreviation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Announce changes to screen readers
  const announceSelection = useCallback(
    (stateName: string, selected: boolean) => {
      const action = selected ? "selected" : "deselected";
      const count = selected
        ? selectedStates.length + 1
        : selectedStates.length - 1;
      announceToScreenReader(`${stateName} ${action}. ${count} states selected.`, "polite");
    },
    [selectedStates.length, announceToScreenReader]
  );

  // Toggle state selection
  const toggleState = useCallback(
    (stateId: string) => {
      setSelectedStates((prev) => {
        const isSelected = prev.includes(stateId);
        let newSelection: string[];
        
        if (isSelected) {
          newSelection = prev.filter((id) => id !== stateId);
        } else {
          if (maxSelections && prev.length >= maxSelections) {
            announceToScreenReader(`Maximum ${maxSelections} states can be selected`, "assertive");
            return prev;
          }
          newSelection = [...prev, stateId];
        }
        
        const stateName = states.find((s) => s.id === stateId)?.name || stateId;
        announceSelection(stateName, !isSelected);
        onSelectionChange?.(newSelection);
        
        return newSelection;
      });
    },
    [maxSelections, states, onSelectionChange, announceSelection, announceToScreenReader]
  );

  // Select all visible states
  const selectAll = useCallback(() => {
    const visibleIds = filteredStates.map((s) => s.id);
    const newSelection = [...new Set([...selectedStates, ...visibleIds])];
    if (maxSelections && newSelection.length > maxSelections) {
      announceToScreenReader(`Cannot select all. Exceeds maximum of ${maxSelections} states.`, "assertive");
      return;
    }
    setSelectedStates(newSelection);
    onSelectionChange?.(newSelection);
    announceToScreenReader(`Selected all ${visibleIds.length} visible states`, "polite");
  }, [filteredStates, selectedStates, maxSelections, onSelectionChange, announceToScreenReader]);

  // Clear all selections
  const clearAll = useCallback(() => {
    setSelectedStates([]);
    onSelectionChange?.([]);
    announceToScreenReader("All selections cleared", "polite");
    searchInputRef.current?.focus();
  }, [onSelectionChange, announceToScreenReader]);

  // Focus management
  const focusStateAtIndex = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, filteredStates.length - 1));
      setFocusedIndex(clampedIndex);
      
      const element = listboxRef.current?.querySelector(
        `[data-state-index="${clampedIndex}"]`
      ) as HTMLElement;
      element?.focus();
    },
    [filteredStates.length]
  );

  // Keyboard navigation for listbox
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const { key, ctrlKey, metaKey } = event;
      
      switch (key) {
        case "ArrowDown":
          event.preventDefault();
          focusStateAtIndex(focusedIndex + 1);
          break;
          
        case "ArrowUp":
          event.preventDefault();
          if (focusedIndex === 0) {
            // Move focus back to search input
            searchInputRef.current?.focus();
            setFocusedIndex(-1);
          } else {
            focusStateAtIndex(focusedIndex - 1);
          }
          break;
          
        case "Home":
          event.preventDefault();
          focusStateAtIndex(0);
          break;
          
        case "End":
          event.preventDefault();
          focusStateAtIndex(filteredStates.length - 1);
          break;
          
        case " ":
        case "Enter":
          event.preventDefault();
          if (focusedIndex >= 0 && filteredStates[focusedIndex]) {
            toggleState(filteredStates[focusedIndex].id);
          }
          break;
          
        case "Escape":
          event.preventDefault();
          searchInputRef.current?.focus();
          setFocusedIndex(-1);
          break;
          
        case "a":
          if (ctrlKey || metaKey) {
            event.preventDefault();
            selectAll();
          }
          break;
          
        case "*":
          event.preventDefault();
          selectAll();
          break;
      }
    },
    [focusedIndex, filteredStates, focusStateAtIndex, toggleState, selectAll]
  );

  // Keyboard navigation for search input
  const handleSearchKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      const { key } = event;
      
      switch (key) {
        case "ArrowDown":
          event.preventDefault();
          if (filteredStates.length > 0) {
            focusStateAtIndex(0);
          }
          break;
          
        case "Escape":
          if (searchQuery) {
            event.preventDefault();
            setSearchQuery("");
            announceToScreenReader("Search cleared", "polite");
          }
          break;
      }
    },
    [filteredStates.length, searchQuery, focusStateAtIndex, announceToScreenReader]
  );

  // ARIA attributes for the listbox container
  const getAriaAttributes = useCallback(() => {
    return {
      role: "listbox",
      "aria-multiselectable": true,
      "aria-label": "Select states",
      "aria-describedby": `${stateId.current}-instructions`,
      "aria-activedescendant": focusedIndex >= 0 ? `${stateId.current}-option-${focusedIndex}` : undefined,
      tabIndex: 0,
    };
  }, [focusedIndex]);

  // ARIA attributes for individual state options
  const getStateAriaAttributes = useCallback(
    (stateId_value: string, index: number) => {
      const isSelected = selectedStates.includes(stateId_value);
      return {
        id: `${stateId.current}-option-${index}`,
        role: "option",
        "aria-selected": isSelected,
        tabIndex: -1,
        "data-state-index": index,
      };
    },
    [selectedStates]
  );

  // Reset focused index when filtered states change
  useEffect(() => {
    if (focusedIndex >= filteredStates.length) {
      setFocusedIndex(filteredStates.length > 0 ? 0 : -1);
    }
  }, [filteredStates.length, focusedIndex]);

  return {
    selectedStates,
    focusedIndex,
    searchQuery,
    listboxRef,
    searchInputRef,
    filteredStates,
    toggleState,
    selectAll,
    clearAll,
    handleKeyDown,
    handleSearchKeyDown,
    setSearchQuery,
    focusStateAtIndex,
    announceSelection,
    getAriaAttributes,
    getStateAriaAttributes,
  };
}

export default useAccessibleStateSelector;
