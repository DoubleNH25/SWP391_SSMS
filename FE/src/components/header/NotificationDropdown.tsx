import { useCallback, useState, memo, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NotificationAnimation from "@/components/icons/notification.gif";
import NotificationIcon from "@/components/icons/notification.svg";
import {
  Bell,
  Clock,
  CheckCheck,
  Trash2,
  X,
  MoreHorizontal,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotificationViewModel } from "@/types/Notification";
import {
  FecthNotification,
  FecthReadNotification,
  FecthDeleteNotification,
} from "@/services/NotificationService";

const NotificationDropdown: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationData, setNotificationData] = useState<
    NotificationViewModel[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedNotification, setExpandedNotification] = useState<
    string | null
  >(null);

  const fetchData = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await FecthNotification();
      if (response && Array.isArray(response)) {
        setNotificationData(response);
      } else {
        setError("Dữ liệu không hợp lệ.");
        setNotificationData([]);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Không thể tải thông báo. Vui lòng thử lại.");
      toast.error("Không thể tải thông báo. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToggleExpanded = useCallback((notificationId: string) => {
    setExpandedNotification((prev) =>
      prev === notificationId ? null : notificationId
    );
  }, []);

  const handleNotificationClick = useCallback(
    async (notification: NotificationViewModel) => {
      if (!notification.isRead) {
        try {
          await FecthReadNotification(notification.id);
          fetchData(); // Call fetchData directly without await to avoid blocking
        } catch (err) {
          console.error("Failed to mark notification as read:", err);
        }
      }

      if (notification.eventId) {
        setIsOpen(false);
        try {
          if (
            notification.title.toLowerCase().includes("health") ||
            notification.message.toLowerCase().includes("health") ||
            notification.title.toLowerCase().includes("sức khỏe")
          ) {
            navigate(`/activity-medical/${notification.eventId}`);
          } else if (
            notification.title.toLowerCase().includes("vaccination") ||
            notification.message.toLowerCase().includes("vaccination") ||
            notification.title.toLowerCase().includes("tiêm chủng")
          ) {
            navigate(`/vaccinations/${notification.eventId}`);
          } else if (
            notification.title.toLowerCase().includes("medical") ||
            notification.message.toLowerCase().includes("medical") ||
            notification.title.toLowerCase().includes("y tế")
          ) {
            navigate(`/medical-events/${notification.eventId}`);
          } else {
            navigate(`/events/${notification.eventId}`);
          }

          toast.success("Đang chuyển đến trang chi tiết...");
        } catch (err) {
          console.error("Navigation error:", err);
          toast.error("Không thể chuyển đến trang chi tiết.");
        }
      } else {
        toast.info("Không có liên kết chi tiết cho thông báo này.");
      }
    },
    [navigate, setIsOpen] // Remove fetchData dependency
  );

  const handleDeleteReadNotifications = useCallback(async () => {
    try {
      setActionLoading("delete");
      await FecthDeleteNotification();
      fetchData(); // Call fetchData directly without await to avoid blocking
      toast.success("Đã xóa thông báo đã đọc", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error("Failed to delete read notifications:", err);
      toast.error("Không thể xóa thông báo đã đọc", {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setActionLoading(null);
    }
  }, []); // Remove fetchData dependency

  const isToday = useCallback((date: string) => {
    const today = new Date();
    const notifDate = new Date(date);
    return notifDate.toDateString() === today.toDateString();
  }, []);

  const isYesterday = useCallback((date: string) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const notifDate = new Date(date);
    return notifDate.toDateString() === yesterday.toDateString();
  }, []);

  const groupedNotifications = useMemo(() => {
    const limitedData = showAllNotifications
      ? notificationData
      : notificationData.slice(0, 5);

    return limitedData.reduce((acc, notification) => {
      const date = new Date(notification.createdTime);
      let groupKey: string;

      if (isToday(notification.createdTime)) {
        groupKey = "Hôm nay";
      } else if (isYesterday(notification.createdTime)) {
        groupKey = "Hôm qua";
      } else {
        groupKey = date.toLocaleDateString();
      }

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(notification);
      return acc;
    }, {} as Record<string, NotificationViewModel[]>);
  }, [notificationData, isToday, isYesterday, showAllNotifications]);

  const unreadCount = useMemo(
    () => notificationData.filter((n) => !n.isRead).length,
    [notificationData]
  );

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setShowAllNotifications(false);
    }
  }, [isOpen]);

  const handleViewAllToggle = useCallback(() => {
    setShowAllNotifications((prev) => !prev);
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []); // Remove fetchData dependency to prevent infinite loop

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const panel = document.getElementById("notification-panel");
      if (isOpen && panel && !panel.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <button
        onClick={toggle}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50"
        aria-label="Toggle Notifications"
      >
        {unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        <img
          src={unreadCount > 0 ? NotificationAnimation : NotificationIcon}
          className="w-5 h-5"
          alt="Notification icon"
        />
      </button>

      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-90 overflow-y-auto overflow-x-hidden transition-opacity duration-700 ${
          isOpen ? "opacity-100 z-50" : "opacity-0 pointer-events-none"
        }`}
        id="notification-dropdown"
      >
        <div
          id="notification-panel"
          className={`w-full sm:w-3/4 md:w-1/2 lg:w-1/3 bg-gray-50 h-screen overflow-y-auto py-8 px-3 absolute right-0 transform transition-transform duration-700 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h5 className="text-2xl font-bold text-gray-900 mb-1">
                Thông báo
              </h5>
              <div className="flex items-center space-x-4 text-sm">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    notificationData.length === 0
                      ? "bg-gray-300 text-gray-800"
                      : unreadCount > 0
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {notificationData.length === 0
                    ? "Không có thông báo"
                    : unreadCount > 0
                    ? `${unreadCount} chưa đọc`
                    : "Tất cả đã đọc"}
                </span>
                {notificationData.length > 5 && !showAllNotifications && (
                  <span className="text-gray-500 text-xs">
                    Hiển thị 5 trong {notificationData.length}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 absolute top-10 right-3">
              {notificationData.some((n) => n.isRead) && (
                <button
                  onClick={handleDeleteReadNotifications}
                  disabled={actionLoading === "delete"}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:from-red-100 hover:to-pink-100 hover:text-red-700 disabled:opacity-50 transition-all duration-200 shadow-sm border border-red-200"
                  title="Xóa thông báo đã đọc"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-xs font-medium">Dọn dẹp</span>
                </button>
              )}

              <button
                onClick={toggle}
                className="p-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 hover:from-gray-100 hover:to-gray-200 hover:text-gray-700 transition-all duration-200 shadow-sm border border-gray-200"
                aria-label="Đóng thông báo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-8">
            {error && !isLoading && (
              <div className="p-4 bg-red-100 text-red-500 text-sm mb-4 rounded-lg border border-red-200">
                <div className="flex items-center mb-2">
                  <X className="w-4 h-4 mr-2" />
                  <span className="font-medium">Lỗi tải dữ liệu</span>
                </div>
                <p className="mb-3">{error}</p>
                <button
                  onClick={fetchData}
                  className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang thử lại..." : "Thử lại"}
                </button>
              </div>
            )}

            {isLoading && notificationData.length === 0 ? (
              <div className="flex flex-col justify-center items-center p-12">
                <svg
                  className="animate-spin h-8 w-8 text-blue-500 mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-gray-500 text-sm">Đang tải thông báo...</p>
              </div>
            ) : (
              <div className="bg-gray-50 relative">
                {/* Loading overlay when refreshing data */}
                {isLoading && notificationData.length > 0 && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <div className="flex flex-col items-center">
                      <svg
                        className="animate-spin h-6 w-6 text-blue-500 mb-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <p className="text-gray-600 text-xs">Đang cập nhật...</p>
                    </div>
                  </div>
                )}

                <div className="divide-y divide-gray-100">
                  {Object.keys(groupedNotifications).length > 0 ? (
                    Object.entries(groupedNotifications).map(
                      ([dateGroup, groupNotifications]) => (
                        <div key={dateGroup}>
                          <div className="flex items-center mb-4">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                {dateGroup}
                              </h2>
                            </div>
                            <div className="flex-1 h-px bg-gray-200 ml-4"></div>
                          </div>
                          <div className="space-y-2">
                            {groupNotifications.map((notification) => {
                              const isExpanded =
                                expandedNotification === notification.id;
                              const isUnread = !notification.isRead;

                              return (
                                <div
                                  key={notification.id}
                                  className={`relative overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer ${
                                    isUnread
                                      ? "bg-white border-white shadow-lg ring-white hover:shadow-2xl"
                                      : "bg-gray-200 border-gray-100 opacity-90 shadow-lg hover:shadow-xl"
                                  }`}
                                  onClick={() =>
                                    notification.eventId &&
                                    handleNotificationClick(notification)
                                  }
                                >
                                  {isUnread && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b"></div>
                                  )}

                                  <div className="p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-start space-x-3 flex-1">
                                        <div
                                          className={`flex-shrink-0 p-2 rounded-full ${
                                            isUnread
                                              ? "bg-blue-100 shadow-sm"
                                              : "bg-gray-400"
                                          }`}
                                        >
                                          <Bell
                                            className={`w-4 h-4 ${
                                              isUnread
                                                ? "text-blue-700"
                                                : "text-white"
                                            }`}
                                          />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center justify-between">
                                            <h3
                                              className={`text-sm font-semibold truncate ${
                                                isUnread
                                                  ? "text-black"
                                                  : "text-black-300"
                                              }`}
                                            >
                                              {notification.title}
                                            </h3>

                                            <div className="flex items-center space-x-2 ml-2">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleToggleExpanded(
                                                    notification.id
                                                  );
                                                }}
                                                className={`p-1 rounded-full transition-colors ${
                                                  isUnread
                                                    ? "hover:bg-blue-200 text-blue-600 hover:text-blue-800"
                                                    : "hover:bg-gray-500 text-black-300 hover:text-black-200"
                                                }`}
                                                title={
                                                  isExpanded
                                                    ? "Thu gọn"
                                                    : "Xem chi tiết"
                                                }
                                              >
                                                <MoreHorizontal
                                                  className={`w-4 h-4 transition-transform ${
                                                    isExpanded
                                                      ? "rotate-90"
                                                      : ""
                                                  }`}
                                                />
                                              </button>
                                            </div>
                                          </div>

                                          <p
                                            className={`text-sm mt-1 ${
                                              isExpanded ? "" : "line-clamp-2"
                                            } ${
                                              isUnread
                                                ? "text-gray-800"
                                                : "text-black-400"
                                            }`}
                                          >
                                            {notification.message}
                                          </p>

                                          <div className="flex items-center justify-between mt-2">
                                            <div
                                              className={`flex items-center text-xs ${
                                                isUnread
                                                  ? "text-gray-600"
                                                  : "text-black-400"
                                              }`}
                                            >
                                              <Clock className="w-3 h-3 mr-1" />
                                              {new Date(
                                                notification.createdTime
                                              ).toLocaleString("vi-VN")}
                                            </div>

                                            {notification.eventId && (
                                              <div
                                                className={`text-xs font-medium cursor-pointer ${
                                                  isUnread
                                                    ? "text-blue-700"
                                                    : "text-black-400"
                                                }`}
                                              >
                                                Click để thực hiện thao tác
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {isExpanded && (
                                      <div
                                        className={`mt-4 pt-4 border-t ${
                                          isUnread
                                            ? "border-gray-500"
                                            : "border-gray-500"
                                        }`}
                                      >
                                        <div
                                          className={`rounded-lg p-3 ${
                                            isUnread
                                              ? "bg-gray-200"
                                              : "bg-gray-700"
                                          }`}
                                        >
                                          <h4
                                            className={`text-xs font-medium mb-2 ${
                                              isUnread
                                                ? "text-gray-800"
                                                : "text-gray-300"
                                            }`}
                                          >
                                            Chi tiết thông báo
                                          </h4>
                                          <div className="space-y-2 text-sm">
                                            <div>
                                              <span
                                                className={`font-medium ${
                                                  isUnread
                                                    ? "text-gray-700"
                                                    : "text-gray-400"
                                                }`}
                                              >
                                                Tiêu đề:
                                              </span>
                                              <p
                                                className={`mt-1 ${
                                                  isUnread
                                                    ? "text-black"
                                                    : "text-gray-300"
                                                }`}
                                              >
                                                {notification.title}
                                              </p>
                                            </div>
                                            <div>
                                              <span
                                                className={`font-medium ${
                                                  isUnread
                                                    ? "text-gray-700"
                                                    : "text-gray-400"
                                                }`}
                                              >
                                                Nội dung đầy đủ:
                                              </span>
                                              <p
                                                className={`mt-1 whitespace-pre-wrap ${
                                                  isUnread
                                                    ? "text-gray-800"
                                                    : "text-gray-300"
                                                }`}
                                              >
                                                {notification.message}
                                              </p>
                                            </div>
                                            <div>
                                              <span
                                                className={`font-medium ${
                                                  isUnread
                                                    ? "text-gray-700"
                                                    : "text-gray-400"
                                                }`}
                                              >
                                                Thời gian tạo:
                                              </span>
                                              <p
                                                className={`mt-1 ${
                                                  isUnread
                                                    ? "text-gray-800"
                                                    : "text-gray-300"
                                                }`}
                                              >
                                                {new Date(
                                                  notification.createdTime
                                                ).toLocaleString("vi-VN", {
                                                  weekday: "long",
                                                  year: "numeric",
                                                  month: "long",
                                                  day: "numeric",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                })}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )
                    )
                  ) : !isLoading && notificationData.length === 0 ? (
                    <div className="py-16 text-center">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center shadow-lg border">
                        <Bell className="w-12 h-12 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-700 mb-3">
                        Không có thông báo
                      </h3>
                      <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                        Bạn đã xem hết tất cả thông báo. Chúng tôi sẽ thông báo
                        khi có tin tức mới.
                      </p>
                    </div>
                  ) : null}
                </div>
                {notificationData.length > 5 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleViewAllToggle}
                      className="w-full rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-4 py-3 text-center text-sm font-medium text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200"
                    >
                      {showAllNotifications ? (
                        <span className="flex items-center justify-center">
                          <MoreHorizontal className="w-4 h-4 mr-2 rotate-90" />
                          Hiển thị ít hơn ({notificationData.length - 5} ẩn)
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <MoreHorizontal className="w-4 h-4 mr-2" />
                          Xem tất cả ({notificationData.length - 5} thêm)
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(NotificationDropdown);
