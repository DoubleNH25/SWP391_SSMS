import { useState, useEffect, useRef } from "react";
import Label from "@/components/ui/form/Label";

interface ClassOption {
  value: string;
  label: string;
}

interface ClassSelectorProps {
  classOptions: ClassOption[];
  selectedClasses: string[];
  onClassChange: (classIds: string[]) => void;
  placeholder?: string;
  hasError?: boolean;
}

const ClassSelector = ({
  classOptions,
  selectedClasses,
  onClassChange,
  placeholder = "Chọn lớp hoặc khối",
  hasError = false
}: ClassSelectorProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdownContainer = target.closest('[data-dropdown-container]');
      if (!dropdownContainer && isDropdownOpen) {
        setIsDropdownOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isDropdownOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsDropdownOpen(false);
          setSearchTerm('');
          setFocusedIndex(-1);
          break;
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => {
            const options = getFilteredOptions();
            return Math.min(prev + 1, options.length - 1);
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          event.preventDefault();
          if (focusedIndex >= 0) {
            const options = getFilteredOptions();
            const option = options[focusedIndex];
            if (option) {
              handleClassToggle(option.value);
            }
          }
          break;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen, focusedIndex, classOptions, selectedClasses]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);

  const getFilteredOptions = () => {
    const hierarchicalOptions: { type: 'block' | 'class', value: string, label: string }[] = [];
    const blockMap = new Map();
    const otherClasses: ClassOption[] = [];

    // Classify classes by block
    classOptions.forEach(classOption => {
      const blockMatch = classOption.label.match(/\d+/);
      if (blockMatch) {
        const blockNumber = blockMatch[0];
        if (!blockMap.has(blockNumber)) {
          blockMap.set(blockNumber, []);
        }
        blockMap.get(blockNumber).push(classOption);
      } else {
        otherClasses.push(classOption);
      }
    });

    const sortedBlocks = Array.from(blockMap.keys()).sort((a, b) => parseInt(a) - parseInt(b));

    // Add blocks
    sortedBlocks.forEach(block => {
      const blockLabel = `KHỐI ${block}`;
      if (!searchTerm || blockLabel.toLowerCase().includes(searchTerm.toLowerCase())) {
        hierarchicalOptions.push({
          type: 'block',
          value: `block-${block}`,
          label: blockLabel
        });
      }

      // Add classes in block
      const classesInBlock = blockMap.get(block);
      classesInBlock.forEach((classOption: ClassOption) => {
        if (!searchTerm || classOption.label.toLowerCase().includes(searchTerm.toLowerCase())) {
          hierarchicalOptions.push({
            type: 'class',
            value: classOption.value,
            label: classOption.label
          });
        }
      });
    });

    // Add "Other" block and its classes
    if (otherClasses.length > 0) {
      if (!searchTerm || "Khác".toLowerCase().includes(searchTerm.toLowerCase())) {
        hierarchicalOptions.push({
          type: 'block',
          value: 'block-other',
          label: 'Khác'
        });
      }

      otherClasses.forEach(classOption => {
        if (!searchTerm || classOption.label.toLowerCase().includes(searchTerm.toLowerCase())) {
          hierarchicalOptions.push({
            type: 'class',
            value: classOption.value,
            label: classOption.label
          });
        }
      });
    }

    return hierarchicalOptions;
  };

  const handleClassToggle = (classId: string) => {
    // Prevent deselecting if it's the last selected class
    if (selectedClasses.length === 1 && selectedClasses.includes(classId)) {
      return;
    }

    const newClasses = selectedClasses.includes(classId)
      ? selectedClasses.filter(id => id !== classId)
      : [...selectedClasses, classId];
    onClassChange(newClasses);
  };

  const handleBlockToggle = (blockIdentifier: string) => {
    let classesInBlock: string[] = [];
    
    if (blockIdentifier === 'other') {
      classesInBlock = classOptions
        .filter(classOption => !classOption.label.match(/\d+/))
        .map(classOption => classOption.value);
    } else {
      classesInBlock = classOptions
        .filter(classOption => {
          const numberMatch = classOption.label.match(/\d+/);
          return numberMatch && numberMatch[0] === blockIdentifier;
        })
        .map(classOption => classOption.value);
    }

    const allSelected = classesInBlock.every(id => selectedClasses.includes(id));
    
    // If trying to deselect all classes in a block, ensure at least one remains selected
    if (allSelected && selectedClasses.length <= classesInBlock.length) {
      return;
    }

    const newClasses = allSelected
      ? selectedClasses.filter(id => !classesInBlock.includes(id))
      : [...selectedClasses, ...classesInBlock.filter(id => !selectedClasses.includes(id))];
    
    onClassChange(newClasses);
  };

  const renderDropdownOptions = () => {
    const options = getFilteredOptions();
    
    if (options.length === 0) {
      return <div className="px-4 py-2 text-gray-500">Không có lớp nào</div>;
    }

    return options.map((option, index) => {
      const isBlock = option.type === 'block';
      const isSelected = isBlock
        ? (() => {
            const blockNumber = option.value.replace('block-', '');
            const classesInBlock = classOptions
              .filter(classOption => {
                if (blockNumber === 'other') {
                  return !classOption.label.match(/\d+/);
                }
                const numberMatch = classOption.label.match(/\d+/);
                return numberMatch && numberMatch[0] === blockNumber;
              })
              .map(classOption => classOption.value);
            return classesInBlock.every(id => selectedClasses.includes(id));
          })()
        : selectedClasses.includes(option.value);

      // Disable checkbox if it's the last selected class
      const isDisabled = !isBlock && selectedClasses.length === 1 && isSelected;

      return (
        <div
          key={option.value}
          className={`flex items-center px-4 py-2 ${isBlock ? '' : 'pl-8'} hover:bg-gray-100 cursor-pointer ${
            index === focusedIndex ? 'bg-gray-100' : ''
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !isDisabled && (isBlock ? handleBlockToggle(option.value.replace('block-', '')) : handleClassToggle(option.value))}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            disabled={isDisabled}
            className={`mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
              isDisabled ? 'cursor-not-allowed' : ''
            }`}
          />
          <span className={`${isBlock ? 'font-semibold' : ''} text-sm ${isBlock ? 'text-gray-900' : 'text-gray-700'}`}>
            {option.label}
          </span>
        </div>
      );
    });
  };

  return (
    <div>
      <Label className="block text-sm font-semibold text-gray-700 mb-1">
        Lớp <span className="text-red-500">*</span>
      </Label>

      <div className="relative" data-dropdown-container ref={dropdownRef}>
        <div
          className={`h-11 w-full appearance-none rounded-lg border bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 cursor-pointer ${
            hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10'
          }`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="block truncate text-gray-400">
            {selectedClasses.length > 0
              ? `${selectedClasses.length} lớp đã chọn`
              : placeholder
            }
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
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
        </div>

        {isDropdownOpen && (
          <div className="absolute mt-1 w-full rounded-lg bg-white shadow-lg z-10 border border-gray-300 max-h-60 overflow-auto">
            <input
              ref={searchInputRef}
              type="text"
              className="h-11 w-full appearance-none rounded-t-lg border-b border-gray-300 bg-transparent px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setFocusedIndex(-1);
              }}
              autoComplete="off"
            />
            <div className="py-1">
              {renderDropdownOptions()}
            </div>
          </div>
        )}
      </div>

      {/* Selected Classes Display */}
      {selectedClasses.length > 0 && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <Label className="text-sm font-medium text-gray-700">Lớp đã chọn ({selectedClasses.length})</Label>
            <button
              type="button"
              onClick={() => onClassChange([])}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Xóa tất cả
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedClasses.map(classId => {
              const classOption = classOptions.find(opt => opt.value === classId);
              return (
                <span
                  key={classId}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {classOption?.label || classId}
                  <button
                    type="button"
                    onClick={() => handleClassToggle(classId)}
                    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSelector;
