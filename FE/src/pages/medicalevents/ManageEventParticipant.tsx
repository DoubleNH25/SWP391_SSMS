import Label from "@/components/ui/form/Label";
import Select from "@/components/ui/form/Select";
import PageHeader from "@/components/ui/PageHeader";
import { FetchGetEventParticipant } from "@/services/MedicalEventService";
import {
  FecthParentBystudentId,
  FecthStudentById,
} from "@/services/UserService";

import { MedicalEventParticipantViewModel } from "@/types/MedicalEvent";
import { UserCog } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function ManageEventParticipant() {
  const [itemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchDate, setSearchDate] = useState<string>("");
  const [data, setData] = useState<MedicalEventParticipantViewModel[]>([]);
  const [selectedView, setSelectedView] = useState<
    "HealthActivity" | "VaccinationCampaign"
  >("HealthActivity");

  const viewOptions = useMemo(
    () => [
      { value: "HealthActivity", label: "Kiểm tra sức khỏe" },
      { value: "VaccinationCampaign", label: "Chiến dịch tiêm chủng" },
    ],
    []
  );

  const fetchData = async () => {
    try {
      const response = await FetchGetEventParticipant(selectedView);
      const data = await Promise.all(
        response.map(async (item) => {
          const parent = await FecthParentBystudentId(item.studentId);
          const studentInfo = await FecthStudentById(item.studentId);
          return {
            ...item,
            parentName: parent?.fullName || "",
            parentPhone: parent?.phone || "",
            parentEmail: parent?.email || "",
            className: studentInfo?.studentClass?.className || "",
          };
        })
      );
      setData(data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedView]);

  const handleSort = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  };

  const handleSelectChange = (value: string) => {
    setSelectedView(value as "HealthActivity" | "VaccinationCampaign");
    setCurrentPage(1);
  };

  // Filter data based on search criteria
  const filteredStudents = useMemo(() => {
    let filtered = [...data];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((item) => {
        return (
          item.activityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Filter by date
    if (searchDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.scheduleTime).toDateString();
        const filterDate = new Date(searchDate).toDateString();
        return itemDate === filterDate;
      });
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.scheduleTime).getTime();
      const dateB = new Date(b.scheduleTime).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [data, searchTerm, searchDate, selectedView, sortOrder]);

  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedUsers = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-5 mb-5 p-4">
      <PageHeader
        title="Quản lý người tham gia sự kiện"
        icon={<UserCog className="w-6 h-6 text-blue-600" />}
        description="Quản lý danh sách người được mời tham gia sự kiện"
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium text-gray-700">
                Loại sự kiện
              </Label>
              <Select
                options={viewOptions}
                defaultValue={selectedView}
                placeholder="Chọn một tùy chọn"
                onChange={handleSelectChange}
                className="dark:bg-dark-900 text-sm w-[200px] text-gray-500 border-gray-200 placeholder-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Bộ lọc tìm kiếm
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSort}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                title={
                  sortOrder === "asc" ? "Sắp xếp tăng dần" : "Sắp xếp giảm dần"
                }
              >
                <span>Sắp xếp theo ngày</span>
                {sortOrder === "asc" ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>
              {(searchTerm || searchDate) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSearchDate("");
                    setCurrentPage(1);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Tìm kiếm theo tên học sinh, tên sự kiện hoặc mô tả
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Nhập tên học sinh, tên sự kiện hoặc mô tả..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-gray-700">
                Lọc theo ngày
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => {
                    setSearchDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                {searchDate && (
                  <button
                    onClick={() => {
                      setSearchDate("");
                      setCurrentPage(1);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          {(searchTerm || searchDate) && (
            <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Hiển thị kết quả cho{" "}
                {searchTerm && (
                  <span className="font-medium">"{searchTerm}"</span>
                )}
                {searchTerm && searchDate && " và "}
                {searchDate && (
                  <span className="font-medium">
                    ngày: {new Date(searchDate).toLocaleDateString()}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên học sinh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên phụ huynh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại sự kiện
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên sự kiện
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lịch trình
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người phụ trách
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.studentName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Lớp: {user.className}
                    </div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {" "}
                      {user.studentName}
                    </div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {" "}
                      {user.parentPhone}
                    </div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {" "}
                      {user.parentEmail}
                    </div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {selectedView === "HealthActivity"
                        ? "Kiểm tra sức khỏe"
                        : "Chiến dịch tiêm chủng"}
                    </span>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.activityName}
                    </div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(user.scheduleTime).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(user.scheduleTime).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.responsibleUserName}
                    </div>
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : user.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.status === "Approved"
                        ? "Đã duyệt"
                        : user.status === "Rejected"
                        ? "Từ chối"
                        : "Chờ duyệt"}
                    </span>
                  </td>
                  <td className="px-6 py-2">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {user.description || "Không có mô tả"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy học sinh nào
          </div>
        )}

        {/* Pagination */}
        {filteredStudents.length > 0 && totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  đến{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, totalItems)}
                  </span>{" "}
                  trong tổng số{" "}
                  <span className="font-medium">{totalItems}</span> kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
