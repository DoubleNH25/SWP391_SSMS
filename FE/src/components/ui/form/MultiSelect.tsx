import React, { useState, useEffect, useRef } from 'react';
import { Option } from './Select';

interface MultiSelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (values: string[]) => void;
  className?: string;
  value?: string[];
  defaultValue?: string[];
  maxDisplayItems?: number;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  placeholder = 'Select options',
  onChange,
  className = '',
  value,
  defaultValue = [],
  maxDisplayItems = 3,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>(value || defaultValue);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Update component initialization to use defaultValue
  useEffect(() => {
    if (defaultValue.length > 0 && selectedValues.length === 0) {
      setSelectedValues(defaultValue);
    }
  }, [defaultValue]);

  // Sync controlled value
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(value);
    }
  }, [value]);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open dropdown and focus search input
  const openDropdown = () => {
    setIsOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  // Handle option selection/deselection
  const toggleOption = (optionValue: string) => {
    const newSelectedValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(val => val !== optionValue)
      : [...selectedValues, optionValue];
    
    setSelectedValues(newSelectedValues);
    if (onChange) onChange(newSelectedValues);
  };

  // Remove specific item
  const removeItem = (valueToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelectedValues = selectedValues.filter(val => val !== valueToRemove);
    setSelectedValues(newSelectedValues);
    if (onChange) onChange(newSelectedValues);
  };

  // Clear all selections
  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues([]);
    if (onChange) onChange([]);
  };

  // Get display text for selected items
  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    
    const selectedLabels = selectedValues.map(val => {
      const option = options.find(opt => opt.value === val);
      return option ? option.label : val;
    });

    if (selectedLabels.length <= maxDisplayItems) {
      return selectedLabels.join(', ');
    } else {
      return `${selectedLabels.slice(0, maxDisplayItems).join(', ')} +${selectedLabels.length - maxDisplayItems} more`;
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      tabIndex={0}
    >
      <button
        type="button"
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        className={`h-11 w-full appearance-none text-left rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 ${
          selectedValues.length > 0 ? 'text-gray-800' : 'text-gray-400'
        }`}
      >
        <span className="block truncate">{getDisplayText()}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {/* Selected items display */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedValues.slice(0, maxDisplayItems).map(val => {
            const option = options.find(opt => opt.value === val);
            return (
              <span
                key={val}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
              >
                {option ? option.label : val}
                <button
                  type="button"
                  onClick={(e) => removeItem(val, e)}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            );
          })}
          {selectedValues.length > maxDisplayItems && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
              +{selectedValues.length - maxDisplayItems} more
            </span>
          )}
          {selectedValues.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {isOpen && (
        <div
          className="absolute mt-1 w-full rounded-lg bg-white shadow-lg z-10 border border-gray-300"
          role="listbox"
        >
          <input
            type="text"
            ref={searchInputRef}
            className="h-11 w-full appearance-none rounded-t-lg border-b border-gray-300 bg-transparent px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10"
            placeholder="Search..."
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
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    className={`cursor-pointer select-none relative py-2 px-4 hover:bg-brand-500/10 text-gray-700`}
                    onClick={() => toggleOption(option.value)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // Handled by onClick
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                        {option.label}
                      </span>
                    </div>
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

export default MultiSelect;
