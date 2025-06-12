import React, { useEffect, useState } from "react";
import { DecodeJWT } from "@/utils/DecodeJWT";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import { LayoutDashboard } from "lucide-react";

interface DashboardStats {
  totalStudents: number;
  totalUsers: number;
  pendingEvents: number;
  approvedEvents: number;
}

export default function Home() {
  const [role, setRole] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalUsers: 0,
    pendingEvents: 0,
    approvedEvents: 0,
  });

  useEffect(() => {
    const payload = DecodeJWT();
    if (payload) {
      const role =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const name =
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      if (typeof role === "string") setRole(role);
      if (typeof name === "string") setUserName(name);
    }
  }, []);

  // TODO: Replace with actual API calls
  useEffect(() => {
    // Simulated data
    setStats({
      totalStudents: 150,
      totalUsers: 45,
      pendingEvents: 8,
      approvedEvents: 23,
    });
  }, []);

  const StatCard = ({
    title,
    value,
    icon,
    trend,
  }: {
    title: string;
    value: number;
    icon: React.JSX.Element;
    trend?: { value: number; isPositive: boolean };
  }) => (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
            {trend && (
              <div
                className={cn(
                  "flex items-center mt-2 text-sm",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                <span>
                  {trend.isPositive ? "↑" : "↓"} {trend.value}%
                </span>
                <span className="ml-1 text-gray-500">so với tháng trước</span>
              </div>
            )}
          </div>
          <div className="text-primary">{icon}</div>
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 to-primary/40"></div>
    </Card>
  );

  const renderAdminDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng số học sinh"
          value={stats.totalStudents}
          trend={{ value: 12, isPositive: true }}
          icon={
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Tổng số người dùng"
          value={stats.totalUsers}
          trend={{ value: 8, isPositive: true }}
          icon={
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Sự kiện chờ duyệt"
          value={stats.pendingEvents}
          trend={{ value: 5, isPositive: false }}
          icon={
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Sự kiện đã duyệt"
          value={stats.approvedEvents}
          trend={{ value: 15, isPositive: true }}
          icon={
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Sự kiện y tế gần đây
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for events list */}
              <p className="text-sm text-gray-500">
                Không có sự kiện gần đây để hiển thị.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Cập nhật hệ thống
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for system updates */}
              <p className="text-sm text-gray-500">
                Không có cập nhật gần đây để hiển thị.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderManagerDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Tổng số học sinh"
          value={stats.totalStudents}
          trend={{ value: 12, isPositive: true }}
          icon={
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Sự kiện chờ duyệt"
          value={stats.pendingEvents}
          trend={{ value: 5, isPositive: false }}
          icon={
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Sự kiện đã duyệt"
          value={stats.approvedEvents}
          trend={{ value: 15, isPositive: true }}
          icon={
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Sự kiện y tế gần đây
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for events list */}
              <p className="text-sm text-gray-500">
                Không có sự kiện gần đây để hiển thị.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderNurseDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Tổng số học sinh"
          value={stats.totalStudents}
          trend={{ value: 12, isPositive: true }}
          icon={
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Sự kiện đã duyệt"
          value={stats.approvedEvents}
          trend={{ value: 15, isPositive: true }}
          icon={
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Lịch trình hôm nay
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for schedule */}
              <p className="text-sm text-gray-500">
                Không có sự kiện nào được lên lịch cho hôm nay.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderParentDashboard = () => (
    <>
      <Card className="mb-8">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Chào mừng, {userName}!
          </h2>
          <p className="mt-2 text-gray-600">
            Xem hồ sơ sức khỏe của con bạn và cập nhật các sự kiện y tế của
            chúng.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Hồ sơ sức khỏe của trẻ
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for health profiles */}
              <p className="text-sm text-gray-500">
                Không có hồ sơ sức khỏe để hiển thị.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Sự kiện y tế sắp tới
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for upcoming events */}
              <p className="text-sm text-gray-500">
                Không có sự kiện sắp tới nào được lên lịch.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader
        title="Bảng điều khiển"
        icon={<LayoutDashboard className="w-6 h-6 text-blue-600" />}
        description={`Chào mừng trở lại, ${userName}`}
      />

      {role === "Admin" && renderAdminDashboard()}
      {role === "Manager" && renderManagerDashboard()}
      {role === "Nurse" && renderNurseDashboard()}
      {role === "Parent" && renderParentDashboard()}
    </div>
  );
}
