import React, { useEffect, useState } from "react";
import { DecodeJWT } from "@/utils/DecodeJWT";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import {
  LayoutDashboard,
  Users,
  Clock,
  Stethoscope,
  Pill,
  ListTodo,
  Activity,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  FetchDashboardStats,
  DashboardStats,
} from "@/services/DashboardService";
import { FetchAllBlogs } from "@/services/BlogService";
import { BlogResponse } from "@/types/Blog";

const BlogSlider = () => {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await FetchAllBlogs();
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (blogs.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(timer);
    }
  }, [blogs]);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + blogs.length) % blogs.length
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center text-gray-500">Không có bài viết nào.</div>
    );
  }

  return (
    <div className="relative h-[300px] group">
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        {blogs[currentIndex]?.image && (
          <img
            src={blogs[currentIndex].image}
            alt={blogs[currentIndex].title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-semibold line-clamp-2">
            {blogs[currentIndex]?.title}
          </h3>
        </div>
      </div>

      <button
        onClick={goToPrevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={goToNextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {blogs.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-4" : "bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const [role, setRole] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalUsers: 0,
    totalNurses: 0,
    pendingEvents: 0,
    processingPrescriptions: 0,
    testEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  // Mock data for the medical events table
  const medicalEvents = [
    { product: "Tiêm phòng sởi", price: "-", status: "CHỜ DUYỆT" },
    { product: "Khám định kỳ", price: "-", status: "ĐÃ DUYỆT" },
    { product: "Khám răng", price: "-", status: "CHỜ DUYỆT" },
  ];

  // Mock data for the chart
  const chartData = [
    { label: "6A", value: 40 },
    { label: "7A", value: 60 },
    { label: "8A", value: 80 },
    { label: "9A", value: 100 },
    { label: "10A", value: 70 },
  ];

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

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await FetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <Activity className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dashboard</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng số học sinh</p>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sự kiện chờ duyệt</p>
                  <p className="text-2xl font-bold">{stats.pendingEvents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số nhân viên y tế</p>
                  <p className="text-2xl font-bold">{stats.totalNurses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <Pill className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Đơn thuốc đang xử lý</p>
                  <p className="text-2xl font-bold">
                    {stats.processingPrescriptions}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <ListTodo className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sự kiện xét nghiệm</p>
                  <p className="text-2xl font-bold">{stats.testEvents}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Sự kiện y tế</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Sales</th>
                      <th className="text-left py-3 px-4">More</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicalEvents.map((event, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">{event.product}</td>
                        <td className="py-3 px-4">{event.price}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              event.status === "ĐÃ DUYỆT"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {event.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-800">
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                Tin mới / Cập nhật y tế
              </h2>
              <BlogSlider />
            </div>
          </div>
        </>
      )}
    </>
  );

  const renderManagerDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Dashboard</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng số học sinh</p>
              <p className="text-2xl font-bold">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sự kiện chờ duyệt</p>
              <p className="text-2xl font-bold">{stats.pendingEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Số nhân viên y tế</p>
              <p className="text-2xl font-bold">{stats.totalNurses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Pill className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đơn thuốc đang xử lý</p>
              <p className="text-2xl font-bold">
                {stats.processingPrescriptions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <ListTodo className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sự kiện xét nghiệm</p>
              <p className="text-2xl font-bold">{stats.testEvents}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Sự kiện y tế</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Sales</th>
                  <th className="text-left py-3 px-4">More</th>
                </tr>
              </thead>
              <tbody>
                {medicalEvents.map((event, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{event.product}</td>
                    <td className="py-3 px-4">{event.price}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          event.status === "ĐÃ DUYỆT"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Tin mới / Cập nhật y tế
          </h2>
          <div className="h-[300px] flex items-end justify-between gap-4 px-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${item.value}%` }}
                ></div>
                <span className="mt-2 text-sm text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
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
          value={stats.processingPrescriptions}
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
