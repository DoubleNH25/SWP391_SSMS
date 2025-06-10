import { useCallback, useEffect, useState } from "react";
import { FecthConselingSchedules, FecthUpdateConselingSchedules } from "@/services/MedicalRecordService";
import { ConselingSchedulesAND, ConselingSchedulesANDUpdate } from "@/types/ConselingSchedules";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { customFormatDateOnly } from "@/types/CalendarEvent";
import { FecthUserById } from "@/services/UserService";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/InputField";
import { ChatBubbleLeftRightIcon, UserIcon, CalendarIcon, ClockIcon, PencilSquareIcon, MagnifyingGlassIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import PageHeader from "@/components/ui/PageHeader";

export default function ManagerConselingSchedules() {
    const [conselingSchedules, setConselingSchedules] = useState<ConselingSchedulesAND[]>([]);
    const [filteredSchedules, setFilteredSchedules] = useState<ConselingSchedulesAND[]>([]);
    const [formData, setFormData] = useState<ConselingSchedulesANDUpdate>({
        conselingScheduleId: '',
        scheduledTime: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userNames, setUserNames] = useState<Record<string, string>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ConselingSchedulesAND | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 8;

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!formData.conselingScheduleId) {
                toast.error('Vui lòng chọn lịch tư vấn!');
                return;
            }

            if (!formData.scheduledTime) {
                toast.error('Vui lòng chọn thời gian tư vấn!');
                return;
            }

            const date = new Date(formData.scheduledTime);
            if (isNaN(date.getTime())) {
                toast.error('Thời gian không hợp lệ!');
                return;
            }

            const formattedData = {
                conselingScheduleId: formData.conselingScheduleId,
                scheduledTime: date.toISOString()
            };
            await FecthUpdateConselingSchedules(formattedData);
            toast.success('Cập nhật lịch tư vấn thành công!');
            setIsModalOpen(false);
            fetchConselingSchedules();
        } catch (error: any) {
            console.error('Error submitting form:', error);
            if (error.response?.data) {
                toast.error(error.response.data.message || 'Cập nhật lịch tư vấn thất bại!');
            } else {
                toast.error('Cập nhật lịch tư vấn thất bại!');
            }
        }
    }, [formData]);

    const handleItemClick = (item: ConselingSchedulesAND) => {
        setSelectedItem(item);
        setFormData({
            conselingScheduleId: item.studentId,
            scheduledTime: new Date().toISOString().slice(0, 16) // Format for datetime-local input
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const fetchUserData = useCallback(async (userId: string) => {
        if (!userId || userNames[userId]) return;

        try {
            const data = await FecthUserById(userId);
            if (data?.fullName) {
                setUserNames(prev => ({ ...prev, [userId]: data.fullName }));
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }, [userNames]);

    const fetchConselingSchedules = useCallback(async () => {
        try {
            const data = await FecthConselingSchedules();
            setConselingSchedules(data);
            const uniqueUserIds = new Set<string>();
            data.forEach(item => {
                if (item.createdBy) uniqueUserIds.add(item.createdBy);
                if (item.updatedBy) uniqueUserIds.add(item.updatedBy);
            });

            uniqueUserIds.forEach(userId => {
                fetchUserData(userId);
            });
        } catch (error) {
            setError(error as string);
        } finally {
            setIsLoading(false);
        }
    }, [fetchUserData]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    }, []);

    const handleSort = useCallback(() => {
        setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    }, []);

    useEffect(() => {
        let filtered = [...conselingSchedules];
        
        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(schedule => 
                schedule.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                schedule.parentName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const dateA = new Date(a.meetingDate).getTime();
            const dateB = new Date(b.meetingDate).getTime();
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });

        setFilteredSchedules(filtered);
    }, [conselingSchedules, searchQuery, sortOrder]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredSchedules.length / recordsPerPage);
    const paginatedSchedules = filteredSchedules.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    useEffect(() => {
        fetchConselingSchedules();
    }, [fetchConselingSchedules]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Quản lý lịch tư vấn"
                    icon={<ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />}
                />

                {/* Search and Sort Controls */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Tìm kiếm theo tên học sinh hoặc phụ huynh..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10 w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={handleSort}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <span>Sắp xếp theo ngày</span>
                        {sortOrder === "asc" ? (
                            <ChevronUpIcon className="w-5 h-5" />
                        ) : (
                            <ChevronDownIcon className="w-5 h-5" />
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedSchedules.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                            onClick={() => handleItemClick(item)}
                        >
                            <div className="mb-4 flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">{item.studentName}</h2>
                                    <p className="text-sm mt-2 text-gray-600 flex items-center gap-2">
                                        <UserIcon className="w-4 h-4" />
                                        {item.parentName}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    item.status 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                    {item.status ? 'Đã duyệt' : 'Chờ duyệt'}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                                    <CalendarIcon className="w-4 h-4 text-blue-500" />
                                    <span>Ngày hẹn: {customFormatDateOnly(item.meetingDate)}</span>
                                </div>

                                {item.note && (
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <p className="text-sm text-gray-700">{item.note}</p>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-100 space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <ClockIcon className="w-4 h-4 text-gray-400" />
                                        <span>Tạo lúc: {customFormatDateOnly(item.createdTime)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <PencilSquareIcon className="w-4 h-4 text-gray-400" />
                                        <span>Bởi: {userNames[item.createdBy] || 'Đang tải...'}</span>
                                    </div>
                                    {item.updatedTime && item.updatedTime instanceof Date && !isNaN(item.updatedTime.getTime()) && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <PencilSquareIcon className="w-4 h-4 text-gray-400" />
                                            <span>Cập nhật: {customFormatDateOnly(item.updatedTime)}</span>
                                            <br />
                                            <span>Bởi: {userNames[item.updatedBy] || 'Đang tải...'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Trước
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    currentPage === page
                                        ? "bg-blue-600 text-white"
                                        : "bg-white border border-gray-200 hover:bg-gray-50"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                showCloseButton={true}
                isFullscreen={false}
                className="max-w-md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            Cập nhật lịch tư vấn
                        </h2>
                        {selectedItem && (
                            <div className="space-y-5">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                                        Học sinh
                                    </Label>
                                    <p className="text-gray-900 font-medium">{selectedItem.studentName}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phụ huynh
                                    </Label>
                                    <p className="text-gray-900 font-medium">{selectedItem.parentName}</p>
                                </div>
                                <div>
                                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thời gian tư vấn
                                    </Label>
                                    <Input
                                        type="datetime-local"
                                        min={new Date().toISOString().slice(0, 16)}
                                        value={formData.scheduledTime}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            scheduledTime: e.target.value
                                        }))}
                                        className="mt-1 block w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-8">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                    >
                                        Cập nhật
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </Modal>
        </div>
    );
}