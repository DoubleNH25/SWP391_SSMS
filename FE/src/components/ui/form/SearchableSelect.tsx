import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Option } from './Select';

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  value?: string;
  defaultValue?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder = 'Select an option',
  onChange,
  className = '',
  value,
  defaultValue = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value || defaultValue);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Update component initialization to use defaultValue
  useEffect(() => {
    if (defaultValue && !selectedValue) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue, selectedValue]);

  // Sync controlled value
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value, selectedValue]);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open dropdown and focus search input
  const openDropdown = () => {
    setIsOpen(true);
    setHighlightedIndex(-1);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  // Handle option selection
  const selectOption = (option: Option) => {
    setSelectedValue(option.value);
    if (onChange) onChange(option.value);
    closeDropdown();
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation handling
  const onKeyDown = (e: KeyboardEvent) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      openDropdown();
      return;
    }
    if (isOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          selectOption(filteredOptions[highlightedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeDropdown();
      }
    }
  };

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label ?? placeholder;

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-labelledby="searchable-select-label"
      role="combobox"
    >
      <button
        type="button"
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        className={`h-11 w-full appearance-none text-left rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 ${
          selectedValue ? 'text-gray-800' : 'text-gray-400'
        }`}
        aria-controls="searchable-select-listbox"
        aria-label="Select option"
      >
        <span className="block truncate">{selectedLabel}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.71.29l5.99 6a1 1 0 01-1.42 1.42L10 5.42 4.72 10.71a1 1 0 11-1.42-1.42l5.99-6A1 1 0 0110 3z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute mt-1 w-full rounded-lg bg-white shadow-lg z-10 border border-gray-300"
          role="listbox"
          id="searchable-select-listbox"
          tabIndex={-1}
        >
          <input
            type="text"
            ref={searchInputRef}
            className="h-11 w-full appearance-none rounded-t-lg border-b border-gray-300 bg-transparent px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10"
            placeholder="Search..."
            aria-label="Search options"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
          <ul className="max-h-60 overflow-auto py-1 text-sm rounded-b-lg text-gray-700">
            {filteredOptions.length === 0 ? (
              <li className="cursor-default select-none relative py-2 px-4 text-gray-500">
                No options found
              </li>
            ) : (
              filteredOptions.map((option, idx) => {
                const isSelected = option.value === selectedValue;
                const isHighlighted = idx === highlightedIndex;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    className={`cursor-pointer select-none relative py-2 px-4 ${
                      isHighlighted ? 'bg-brand-500/10 text-gray-800' : 'text-gray-700'
                    }`}
                    onClick={() => selectOption(option)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                  >
                    <span
                      className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}
                    >
                      {option.label}
                    </span>
                    {isSelected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-800">
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
