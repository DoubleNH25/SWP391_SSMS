import { useCallback, useState, memo, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FecthConfirmNotification, FecthNotification } from "@/services/NotificationService";
import { NotificationViewModel } from "@/types/Notification";
import NotificationAnimation from "@/components/icons/notification.gif";
import NotificationIcon from "@/components/icons/notification.svg";
import { Bell, CheckCircle, AlertTriangle, Clock, Heart, Syringe } from 'lucide-react';
import { Modal } from "../ui/modal";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DecodeJWT } from "@/utils/DecodeJWT";

type ActivityType = 'Pending' | 'Approved' | 'HealthActivity' | 'VaccinationCampaign';
type ActionType = 'Approved' | 'Rejected' | null;
type StatusType = "Pending" | "Approved" | "Rejected";

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [notificationData, setNotificationData] = useState<NotificationViewModel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<NotificationViewModel | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  const fetchData = useCallback(async () => {
    const role = DecodeJWT()?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if(role !== "Parent") return;
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await FecthNotification();
      if (response) {
        setNotificationData(response);
        if (response.some(item => item.status === "Pending")) {
          setNotifying(true);
        }
      } else {
        setError("Invalid data.");
        setNotificationData([]);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Failed to load notifications. Please try again.");
      toast.error("Failed to load notifications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleOpenActionModal = useCallback((userId: string) => {
    setSelectedId(userId);
    setIsActionModalOpen(true);
  }, []);

  const handleCloseActionModal = useCallback(() => {
    setIsActionModalOpen(false);
    setSelectedId(null);
  }, []);

  const handleOpenEditModal = useCallback((notification: NotificationViewModel) => {
    setSelectedNotification(notification);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedNotification(null);
  }, []);

  const handleOpenConfirmModal = useCallback((action: ActionType) => {
    setActionType(action);
    setIsConfirmModalOpen(true);
  }, []);

  const handleCloseConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false);
    setActionType(null);
  }, []);

  const handleConfirmAction = useCallback(async () => {
    if (!selectedId || !actionType) return;

    try {
      setConfirmLoading(true);
      const status = actionType === 'Approved';
      const success = await FecthConfirmNotification(selectedId, status.toString());

      if (success) {
        toast.success(`Activity ${actionType === 'Approved' ? 'approved' : 'rejected'} successfully`);
        await fetchData();
      } else {
        toast.error(`Failed to ${actionType === 'Approved' ? 'approve' : 'reject'} activity`);
      }

      handleCloseConfirmModal();
      handleCloseActionModal();
    } catch (err) {
      console.error(`Failed to ${actionType === 'Approved' ? 'approve' : 'Rejected'} activity:`, err);
      toast.error(`Failed to ${actionType === 'Approved' ? 'approve' : 'Rejected'} activity. Please try again.`);
    } finally {
      setConfirmLoading(false);
    }
  }, [selectedId, actionType, fetchData, handleCloseConfirmModal, handleCloseActionModal]);

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

  const getActivityIcon = useCallback((activityType: ActivityType, status: StatusType) => {
    if (status === "Pending") {
      return <AlertTriangle className="w-5 h-5" />;
    }
    switch (activityType) {
      case 'HealthActivity':
        return <Heart className="w-5 h-5" />;
      case 'VaccinationCampaign':
        return <Syringe className="w-5 h-5" />;
      case 'Approved':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  }, []);

  const getActivityConfig = useCallback((status: StatusType, scheduleTime: string) => {
    if (!isToday(scheduleTime) && !isYesterday(scheduleTime)) {
      return {
        bgColor: 'bg-gradient-to-r from-gray-50 to-gray-100',
        borderColor: 'border-l-gray-400',
        iconColor: 'text-gray-600',
        textColor: 'text-gray-800',
        actionColor: 'text-gray-600 hover:text-gray-800',
      };
    }
    if (status === "Pending") {
      return {
        bgColor: 'bg-gradient-to-r from-yellow-50 to-yellow-100',
        borderColor: 'border-l-yellow-400',
        iconColor: 'text-yellow-600',
        textColor: 'text-yellow-800',
        actionColor: 'text-yellow-600 hover:text-yellow-800',
      };
    }
    if (status === "Rejected") {
      return {
        bgColor: 'bg-gradient-to-r from-red-50 to-red-100',
        borderColor: 'border-l-red-400',
        iconColor: 'text-red-600',
        textColor: 'text-red-800',
        actionColor: 'text-red-600 hover:text-red-800',
      };
    }
    return {
      bgColor: 'bg-gradient-to-r from-green-50 to-green-100',
      borderColor: 'border-l-green-400',
      iconColor: 'text-green-600',
      textColor: 'text-green-800',
      actionColor: 'text-green-600 hover:text-green-800',
    };
  }, [isToday, isYesterday]);

  const groupedNotifications = useMemo(() => {
    // Limit notifications if showAllNotifications is false
    const limitedData = showAllNotifications ? notificationData : notificationData.slice(0, 5);

    return limitedData.reduce((acc, notification) => {
      const date = new Date(notification.scheduleTime);
      let groupKey: string;

      if (isToday(notification.scheduleTime)) {
        groupKey = 'Today';
      } else if (isYesterday(notification.scheduleTime)) {
        groupKey = 'Yesterday';
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

  const unApproveCount = useMemo(() =>
    notificationData.filter(n => n.status === "Pending").length
    , [notificationData]);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
    setNotifying(false);
    // Reset to show limited notifications when closing
    if (!isOpen) {
      setShowAllNotifications(false);
    }
  }, [isOpen]);

  const handleViewAllToggle = useCallback(() => {
    setShowAllNotifications(prev => !prev);
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(intervalId);
  }, [fetchData]);

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
      <Modal
        isOpen={isActionModalOpen}
        onClose={handleCloseActionModal}
        showCloseButton={true}
        isFullscreen={false}
        className="max-w-lg p-6"
      >
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">Activity Details</h2>
          {(() => {
            const notification = notificationData.find(n => n.id === selectedId);
            return notification ? (
              <div className="mt-4 text-left space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Student:</span>
                      <p className="text-gray-900">{notification.studentName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Activity:</span>
                      <p className="text-gray-900">{notification.activityName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Type:</span>
                      <p className="text-gray-900">{notification.activityType}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Status:</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {notification.status}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-gray-600">Schedule:</span>
                      <p className="text-gray-900">{new Date(notification.scheduleTime).toLocaleString('vi-VN')}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-gray-600">Responsible:</span>
                      <p className="text-gray-900">{notification.responsibleUserName}</p>
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-blue-800">Action Required</p>
                  <p>Please choose an action for this activity. Your decision will determine whether your child can participate.</p>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-gray-600">
                Please choose an action for this activity.
              </p>
            );
          })()}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => handleOpenConfirmModal('Rejected')}
              className="rounded bg-red-200 px-8 py-2 text-red-800 hover:bg-red-300"
              disabled={confirmLoading}
            >
              Reject
            </button>
            <button
              onClick={() => handleOpenConfirmModal('Approved')}
              className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
              disabled={confirmLoading}
            >
              Approve
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        showCloseButton={true}
        isFullscreen={false}
        className="max-w-sm p-6"
      >
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {actionType === 'Approved' ? 'Confirm Approval' : 'Confirm Rejection'}
          </h2>
          <p className="mt-2 text-gray-600">
            Are you sure you want to {actionType === 'Approved' ? 'Approved' : 'Rejected'} this activity? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleCloseConfirmModal}
              className="rounded bg-gray-200 px-8 py-2 text-gray-800 hover:bg-gray-300"
              disabled={confirmLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAction}
              className={`rounded px-6 py-2 text-white ${actionType === 'Approved' ? 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300' : 'bg-red-500 hover:bg-red-600 disabled:bg-red-300'}`}
              disabled={confirmLoading}
            >
              {confirmLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {actionType === 'Approved' ? 'Approving...' : 'Rejecting...'}
                </div>
              ) : (
                actionType === 'Approved' ? 'Approve' : 'Reject'
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal for Approved/Rejected notifications */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        showCloseButton={true}
        isFullscreen={false}
        className="max-w-lg p-6"
      >
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">Activity Details</h2>
          {selectedNotification && (
            <div className="mt-4 text-left space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Student:</span>
                    <p className="text-gray-900">{selectedNotification.studentName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Activity:</span>
                    <p className="text-gray-900">{selectedNotification.activityName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Type:</span>
                    <p className="text-gray-900">{selectedNotification.activityType}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Status:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedNotification.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {selectedNotification.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Schedule:</span>
                    <p className="text-gray-900">{new Date(selectedNotification.scheduleTime).toLocaleString('vi-VN')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Responsible:</span>
                    <p className="text-gray-900">{selectedNotification.responsibleUserName}</p>
                  </div>
                </div>
              </div>
              <div className="text-center text-sm text-gray-600">
                This activity has been {selectedNotification.status.toLowerCase()}.
                {selectedNotification.status === "Approved"
                  ? " Your child can participate in this activity."
                  : " Your child will not participate in this activity."
                }
              </div>
            </div>
          )}
          <div className="mt-6">
            <button
              onClick={handleCloseEditModal}
              className="rounded bg-gray-200 px-8 py-2 text-gray-800 hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      <button
        onClick={toggle}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50"
        aria-label="Toggle Notifications"
      >
        {unApproveCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white ring-2 ring-white">
            {unApproveCount > 9 ? '9+' : unApproveCount}
          </span>
        )}
        <img
          src={unApproveCount > 0 ? NotificationAnimation : NotificationIcon}
          className="w-5 h-5"
          alt="Notification icon"
        />
      </button>

      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-90 overflow-y-auto overflow-x-hidden transition-opacity duration-700 ${isOpen ? "opacity-100 z-50" : "opacity-0 pointer-events-none"}`}
        id="notification-dropdown"
      >
        <div
          id="notification-panel"
          className={`w-full sm:w-3/4 md:w-1/2 lg:w-1/3 bg-gray-50 h-screen overflow-y-auto py-8 px-3 absolute right-0 transform transition-transform duration-700 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-2xl font-semibold text-gray-800">Notifications</h5>
              <p className="text-blue-500 text-sm">
                {unApproveCount} pending approvals
                {notificationData.length > 5 && !showAllNotifications && (
                  <span className="text-gray-500"> • Showing 5 of {notificationData.length}</span>
                )}
              </p>
            </div>
            <button
              onClick={toggle}
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-full"
              aria-label="Close Notifications"
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="#4B5563" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 6L18 18" stroke="#4B5563" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="mt-8">
            {error && (
              <div className="p-4 bg-red-100 text-red-500 text-sm mb-4 rounded-lg">
                {error}
                <button
                  onClick={fetchData}
                  className="ml-2 underline text-red-700 hover:text-red-900"
                  disabled={isLoading}
                >
                  Retry
                </button>
              </div>
            )}

            {isLoading && notificationData.length === 0 ? (
              <div className="flex justify-center items-center p-12">
                <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <div className="bg-gray-50">
                <div className="divide-y divide-gray-100">
                  {Object.keys(groupedNotifications).length > 0 ? (
                    Object.entries(groupedNotifications).map(([dateGroup, groupNotifications]) => (
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
                        <div className="space-y-3">
                          {groupNotifications.map(notification => {
                            const config = getActivityConfig(notification.status, notification.scheduleTime);
                            return (
                              <div
                                key={notification.id}
                                className={`relative group ${config.bgColor} ${config.borderColor} border-l-4 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:scale-[1.02]`}
                              >
                                <div className="flex items-start space-x-4">
                                  <div className={`flex-shrink-0 p-2 rounded-lg bg-white/70 ${config.iconColor}`}>
                                    {getActivityIcon(notification.activityType as ActivityType, notification.status)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex justify-between">
                                          <p className={`text-sm font-medium ${config.textColor} leading-relaxed`}>
                                            {notification.studentName && (
                                              <span className="font-semibold text-indigo-700 mr-1">
                                                {notification.studentName}
                                              </span>
                                            )}
                                          </p>
                                          <p className={`text-sm font-medium ${config.textColor} leading-relaxed`}>
                                            {notification.activityName}
                                          </p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <div className="flex mt-2 space-x-3">
                                            <p className="text-xs text-gray-500 flex items-center">
                                              <Clock className="w-3 h-3 mr-1" />
                                              {new Date(notification.scheduleTime).toLocaleString('vi-VN')}
                                            </p>
                                            {notification.status === "Pending" ? (
                                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Pending
                                              </span>
                                            ) : notification.status === "Approved" ? (
                                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Approved
                                              </span>
                                            ) : (
                                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Rejected
                                              </span>
                                            )}
                                          </div>
                                          <div>
                                            <span
                                              onClick={() => {
                                                if (notification.status === "Pending") {
                                                  handleOpenActionModal(notification.id);
                                                } else {
                                                  handleOpenEditModal(notification);
                                                }
                                              }}
                                              className="text-xs text-blue-700 decoration-1 hover:text-blue-900 hover:font-bold underline cursor-pointer"
                                              aria-label="View details"
                                            >
                                              {notification.status === "Pending" ? "Take Action" : "View Details"}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Bell className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-600 mb-2">All caught up!</h3>
                      <p className="text-gray-400">No new notifications at the moment.</p>
                    </div>
                  )}
                </div>
                {notificationData.length > 5 && (
                  <button
                    onClick={handleViewAllToggle}
                    className="mt-3 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    {showAllNotifications ? `Show Less (${notificationData.length - 5} hidden)` : `View All (${notificationData.length - 5} more)`}
                  </button>
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
