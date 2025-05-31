import { useCallback, useState, memo } from "react";
import { Link } from "react-router";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

// Sample notification data
const notifications = [
  // {
  //   id: 1,
  //   user: "Terry Franci",
  //   image: "/images/user/user-02.jpg",
  //   action: "requests permission to change",
  //   project: "Project - Nganter App",
  //   type: "Project",
  //   time: "5 min ago",
  //   status: "success",
  // },
  // {
  //   id: 2,
  //   user: "Alena Franci",
  //   image: "/images/user/user-03.jpg",
  //   action: "requests permission to change",
  //   project: "Project - Nganter App",
  //   type: "Project",
  //   time: "8 min ago",
  //   status: "success",
  // },
  // {
  //   id: 3,
  //   user: "Jocelyn Kenter",
  //   image: "/images/user/user-04.jpg",
  //   action: "requests permission to change",
  //   project: "Project - Nganter App",
  //   type: "Project",
  //   time: "15 min ago",
  //   status: "success",
  // },
  // {
  //   id: 4,
  //   user: "Brandon Philips",
  //   image: "/images/user/user-05.jpg",
  //   action: "requests permission to change",
  //   project: "Project - Nganter App",
  //   type: "Project",
  //   time: "1 hr ago",
  //   status: "error",
  // },
];

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
    setNotifying(false);
  }, []);

  const closeDropdown = useCallback(() => setIsOpen(false), []);

  return (
    <div className="relative">
      <button
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        onClick={toggleDropdown}
        aria-label="Toggle Notifications"
      >
        {notifying && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
          </span>
        )}
        <svg
          className="fill-current"
          width={20}
          height={20}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 1.54a.75.75 0 00-.75.75v.55c-3.58.39-6.25 3.37-6.25 6.87v5.29H2.33a.75.75 0 000 1.5h1.67h11.25h1.67a.75.75 0 000-1.5H16.5v-5.29c0-3.5-2.67-6.48-6.25-6.87v-.55a.75.75 0 00-.75-.75zm4.5 12.91v-5.29a5.25 5.25 0 10-10.5 0v5.29h10.5zm-6 3.25a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5z"
            fill="currentColor"
          />
        </svg>
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute mt-4 flex w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg lg:right-0"
      >
        <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3">
          <h5 className="text-lg font-semibold text-gray-800 ">Notifications</h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition-colors hover:text-gray-700 "
            aria-label="Close Notifications"
          >
            <svg
              className="fill-current"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.22 6.22a.75.75 0 011.06 0L12 10.94l4.78-4.78a.75.75 0 111.06 1.06L13.06 12l4.78 4.78a.75.75 0 01-1.06 1.06L12 13.06l-4.78 4.78a.75.75 0 01-1.06-1.06L10.94 12 6.22 7.22a.75.75 0 010-1.06z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <ul className="flex max-h-[400px] flex-col overflow-y-auto custom-scrollbar
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-gray-100
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-gray-300">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100"
                to={notification.id === 4 ? "/" : undefined}
              >
                <span className="relative h-10 w-10">
                  <img
                    src={notification.image}
                    alt={notification.user}
                    className="h-full w-full rounded-full object-cover"
                    width={40}
                    height={40}
                  />
                  <span
                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-[1.5px] border-white ${
                      notification.status === "success" ? "bg-success-500" : "bg-error-500"
                    }`}
                  />
                </span>
                <span className="flex-1">
                  <span className="mb-1.5 flex gap-1 text-sm text-gray-500">
                    <span className="font-medium text-gray-800 ">
                      {notification.user}
                    </span>
                    <span>{notification.action}</span>
                    <span className="font-medium text-gray-800 ">
                      {notification.project}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{notification.type}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-400" />
                    <span>{notification.time}</span>
                  </span>
                </span>
              </DropdownItem>
            </li>
          ))}
        </ul>
        <Link
          to="/"
          className="mt-3 block rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 "
        >
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
};

export default memo(NotificationDropdown);