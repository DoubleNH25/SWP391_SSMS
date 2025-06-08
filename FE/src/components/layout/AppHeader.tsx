import { useCallback, useEffect, useRef, useState, memo } from "react";
import { useSidebar } from "../context/sidebar";
import NotificationDropdown from "../header/NotificationDropdown";
import UserDropdown from "../header/UserDropdown";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = useCallback(() => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  }, [toggleSidebar, toggleMobileSidebar]);

  const toggleApplicationMenu = useCallback(() => {
    setApplicationMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex w-full bg-white border-b border-gray-200">
      <div className="flex w-full flex-col items-center h-[5rem] justify-between lg:flex-row lg:px-6">
        <div className="flex w-full items-center justify-between gap-4 border-b border-gray-200 px-3 py-2  lg:border-b-0 lg:px-0 lg:py-2">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.22 7.28a.75.75 0 011.06 0L12 12l-4.78 4.78a.75.75 0 01-1.06-1.06L10.94 12 6.22 7.28a.75.75 0 010-1.06zM17.78 7.28a.75.75 0 010 1.06L13.06 12l4.78 4.78a.75.75 0 11-1.06 1.06L12 13.06l-4.78 4.78a.75.75 0 01-1.06-1.06L10.94 12 6.22 7.28a.75.75 0 011.06-1.06L12 10.94l4.78-4.66a.75.75 0 011.06 0z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width={14}
                height={10}
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.58 1c0-.414.34-.75.75-.75h13.33c.42 0 .75.336.75.75s-.33.75-.75.75H1.33c-.41 0-.75-.336-.75-.75zm0 10c0-.414.34-.75.75-.75h13.33c.42 0 .75.336.75.75s-.33.75-.75.75H1.33c-.41 0-.75-.336-.75-.75zm0-5c0-.414.34-.75.75-.75h6.67c.41 0 .75.336.75.75s-.34.75-.75.75H1.33c-.41 0-.75-.336-.75-.75z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
          <button
            onClick={toggleApplicationMenu}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 lg:hidden"
            aria-label="Toggle Application Menu"
          >
            <svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 10.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm12 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-6 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
                fill="currentColor"
              />
            </svg>
          </button>

          <div className="hidden lg:block">
          </div>
        </div>

        <div
          className={`w-full px-5 lg:flex lg:justify-end lg:px-0 lg:py-0 lg:shadow-none ${isApplicationMenuOpen ? "flex" : "hidden"
            } items-center justify-between gap-4 shadow-theme-md`}
        >
          <div className="flex items-center gap-10">
            <NotificationDropdown />
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(AppHeader);