import { useCallback, useState, memo, useEffect } from "react";
import { Link } from "react-router-dom";
import { FecthNotification } from "@/services/NotificationService";
import { NotificationViewModel } from "@/types/Notification";
import NotificationAnimation from "@/components/icons/notification.gif";
import NotificationIcon from "@/components/icons/notification.svg";
import { Bell, CheckCircle, AlertTriangle, Clock, Heart, Syringe } from 'lucide-react';

type ActivityType = 'Pending' | 'Approve' | 'HealthActivity' | 'VaccinationCampaign';

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [, setNotifying] = useState(false);
  const [notificationData, setNotificationData] = useState<NotificationViewModel[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await FecthNotification();
      if (response) {
        setNotificationData(response);
        if (response.some(item => !item.status)) {
          setNotifying(true);
        }
      } else {
        setError("Invalid data.");
        setNotificationData([]);
      }
      setError(null);
    } catch (err) {
      setError("Failed to load notifications. Please try again.");
    }
  };

  const handleConfirmActivity = () => {
    try{

    }catch(err){

    }finally{

    }
  }

  const getActivityIcon = (activityType: ActivityType, status: boolean) => {
    if (!status) {
      return <AlertTriangle className="w-5 h-5" />;
    }
    switch (activityType) {
      case 'HealthActivity':
        return <Heart className="w-5 h-5" />;
      case 'VaccinationCampaign':
        return <Syringe className="w-5 h-5" />;
      case 'Approve':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getActivityConfig = (activityType: ActivityType, status: boolean, scheduleTime: string) => {
    if (!isToday(scheduleTime) && !isYesterday(scheduleTime)) {
      return {
        bgColor: 'bg-gradient-to-r from-gray-50 to-gray-100',
        borderColor: 'border-l-gray-400',
        iconColor: 'text-gray-600',
        textColor: 'text-gray-800',
        actionColor: 'text-gray-600 hover:text-gray-800',
      };
    }
    if (!status) {
      return {
        bgColor: 'bg-gradient-to-r from-red-50 to-red-100',
        borderColor: 'border-l-red-400',
        iconColor: 'text-red-600',
        textColor: 'text-red-800',
        actionColor: 'text-red-600 hover:text-red-800',
      };
    } else if (status) {
      return {
        bgColor: 'bg-gradient-to-r from-green-50 to-green-100',
        borderColor: 'border-l-green-400',
        iconColor: 'text-green-600',
        textColor: 'text-green-800',
        actionColor: 'text-green-600 hover:text-green-800',
      };
    }
    return {
      bgColor: 'bg-gradient-to-r from-gray-50 to-gray-100',
      borderColor: 'border-l-gray-400',
      iconColor: 'text-gray-600',
      textColor: 'text-gray-800',
      actionColor: 'text-gray-600 hover:text-gray-800',
    };
  };

  const isToday = (date: string) => {
    const today = new Date();
    const notifDate = new Date(date);
    return notifDate.toDateString() === today.toDateString();
  };

  const isYesterday = (date: string) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const notifDate = new Date(date);
    return notifDate.toDateString() === yesterday.toDateString();
  };

  const groupedNotifications = notificationData.reduce((acc, notification) => {
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

  const unApproveCount = notificationData.filter(n => !n.status).length;

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
    setNotifying(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const panel = document.getElementById("notification-panel");
      if (panel && !panel.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="py-8">
      <button
        onClick={toggle}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-gray-500 transition-colors"
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
          className={`w-full lg:w-1/3 bg-gray-50 h-screen overflow-y-auto py-8 px-3 absolute right-0 transform transition-transform duration-700 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-2xl font-semibold text-gray-800">Notifications</h5>
              <p className="text-blue-500 text-sm">{notificationData.length} new updates</p>
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
              <div className="p-4 bg-red-100 text-red-500 text-sm mb-4">
                {error}
              </div>
            )}
            <div className="bg-gray-50">
              <div className="divide-y divide-gray-100">
                {Object.entries(groupedNotifications).map(([dateGroup, groupNotifications]) => (
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
                        const config = getActivityConfig(notification.activityType as ActivityType, notification.status, notification.scheduleTime);
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
                                    <div className="flex items-center mt-2 space-x-3">
                                      <p className="text-xs text-gray-500 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {new Date(notification.scheduleTime).toLocaleString('vi-VN')}
                                      </p>
                                      {notification.status === false ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                          Pending
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                          Approve
                                        </span>
                                      )}
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
                ))}
              </div>
              {notificationData.length === 0 && (
                <div className="p-12 text-center">
                  <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">All caught up!</h3>
                  <p className="text-gray-400">No new notifications at the moment.</p>
                </div>
              )}
            </div>
            {notificationData.length !== 0 && (
              <Link
                to="/notifications"
                className="mt-3 block rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                View All Notifications
              </Link>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(NotificationDropdown);