import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "@/components/icons"
import { useNavigate } from 'react-router-dom';
import { PlusIcon, Pill, X, Search, TrashIcon, ArrowUp, ArrowDown } from "lucide-react";
import { FecthDeleteMedical, FecthMedical } from "@/services/MedicalService";
import { MedicalViewModel } from "@/types/Medical";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageHeader from "@/components/ui/PageHeader";
import Label from "@/components/ui/form/Label";
import { Modal } from "@/components/ui/modal";

type SortDirection = 'asc' | 'desc' | null;

export default function MedicalManager() {
    const [medicines, setMedicines] = useState<MedicalViewModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const navigate = useNavigate();

    // Filter medicines based on search term and date
    const filteredMedicines = medicines.filter((medicine) => {
        const matchesSearch = !searchTerm ||
            medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicine.detailInformation.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate = !searchDate ||
            new Date(medicine.expiryDate).toLocaleDateString("vi-VN").includes(searchDate);

        return matchesSearch && matchesDate;
    });

    // Sort medicines based on expiry date
    const sortedMedicines = [...filteredMedicines].sort((a, b) => {
        if (!sortDirection) return 0;
        const dateA = new Date(a.expiryDate).getTime();
        const dateB = new Date(b.expiryDate).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const totalItems = sortedMedicines.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedMedicines = sortedMedicines.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedMedicines = await FecthMedical();
            setMedicines(fetchedMedicines);
            setError(null);
        } catch (err) {
            setError(err instanceof Error && err.message.includes('authenticated')
                ? 'Vui lòng đăng nhập để xem thuốc.'
                : 'Không thể lấy dữ liệu thuốc. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCreateMedicine = useCallback(() => {
        navigate('/medical/create-medical');
    }, [navigate]);

    const handleDeleteMedicine = useCallback(async (medicineId: string) => {
        try {
            await FecthDeleteMedical(medicineId);
            fetchData();
            toast.success("Xóa thuốc thành công");
        } catch (err) {
            console.error("Failed to delete medicine:", err);
            toast.error("Xóa thuốc thất bại");
        }
    }, [fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdateMedicine = useCallback((medicineId: string) => {
        navigate(`/medical/update-medical/${medicineId}`);
    }, [navigate]);

    const handleItemsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    }, []);

    const handleClearFilters = useCallback(() => {
        setSearchTerm("");
        setSearchDate("");
        setCurrentPage(1);
    }, []);

    const handleSortExpiryDate = useCallback(() => {
        setSortDirection(current => {
            if (current === 'desc') return 'asc';
            if (current === 'asc') return null;
            return 'desc';
        });
    }, []);

    const handleOpenDeleteModal = useCallback((medicineId: string) => {
        setSelectedMedicineId(medicineId);
        setIsDeleteModalOpen(true);
    }, []);

    const handleCloseDeleteModal = useCallback(() => {
        setIsDeleteModalOpen(false);
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        if (selectedMedicineId) {
            handleDeleteMedicine(selectedMedicineId);
            setIsDeleteModalOpen(false);
        }
    }, [selectedMedicineId, handleDeleteMedicine]);

    return (
        <div className="p-4">
            <ToastContainer position="top-right" autoClose={3000} />
            <PageHeader
                title="Quản lý thuốc"
                icon={<Pill className="w-6 h-6 text-blue-600" />}
                description="Quản lý thông tin thuốc trong kho"
            />


            {/* Search Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Bộ lọc tìm kiếm</h2>
                        {(searchTerm || searchDate) && (
                            <button
                                onClick={handleClearFilters}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="search">Tìm kiếm</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="search"
                                    placeholder="Tìm kiếm theo tên thuốc hoặc thông tin thuốc..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-colors"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="w-1/2">
                            <Label htmlFor="dateSearch">Tìm theo ngày hết hạn</Label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="dateSearch"
                                    value={searchDate}
                                    onChange={(e) => {
                                        setSearchDate(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="block w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {searchDate && (
                                    <button
                                        onClick={() => setSearchDate("")}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {(searchTerm || searchDate) && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                                Hiển thị kết quả cho {searchTerm && <span className="font-medium">"{searchTerm}"</span>}
                                {searchTerm && searchDate && " và "}
                                {searchDate && <span className="font-medium">ngày {new Date(searchDate).toLocaleDateString("vi-VN")}</span>}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-end mb-6 absolute right-[16px] top-[140px]">
                <div className="flex items-center gap-2">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                        onClick={handleCreateMedicine}
                    >
                        <PlusIcon className="w-4 h-4" />
                        Thêm thuốc mới
                    </button>
                </div>
            </div>
            {loading ? (
                <div className="text-center text-gray-500">Đang tải...</div>
            ) : error ? (
                <div role="alert" className="text-center text-red-500 p-4 bg-red-100 rounded">
                    <p>{error}</p>
                    {error.includes('authenticated') ? (
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Đăng nhập
                        </button>
                    ) : (
                        <button
                            onClick={fetchData}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Thử lại
                        </button>
                    )}
                </div>
            ) : medicines.length === 0 ? (
                <div className="text-center text-gray-600">Không có thuốc nào</div>
            ) : (
                <div className="space-y-6">
                    <Modal
                        isOpen={isDeleteModalOpen}
                        isFullscreen={false}
                        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden w-2/5"
                        onClose={() => setIsDeleteModalOpen(false)}>
                        <div className="flex flex-col gap-6 p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-100 rounded-full">
                                    <TrashIcon className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Xóa thuốc</h2>
                                    <p className="text-sm text-gray-500 mt-1">Bạn có chắc chắn muốn xóa thuốc này không?</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleCloseDeleteModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Hủy bỏ
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteConfirm}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                                >
                                    Xác nhận
                                </Button>
                            </div>
                        </div>
                    </Modal>
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tên thuốc
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Số lượng
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <button
                                                onClick={handleSortExpiryDate}
                                                className="flex items-center gap-1 hover:text-gray-700"
                                            >
                                                Hạn sử dụng
                                                {sortDirection === 'asc' ? (
                                                    <ArrowUp className="w-4 h-4" />
                                                ) : sortDirection === 'desc' ? (
                                                    <ArrowDown className="w-4 h-4" />
                                                ) : (
                                                    <ArrowUp className="w-4 h-4 text-gray-300" />
                                                )}
                                            </button>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thông tin chi tiết
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedMedicines.map((medicine) => (
                                        <tr key={medicine.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-2 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {medicine.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                                {medicine.quantity}
                                            </td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(medicine.expiryDate).toLocaleDateString("vi-VN")}
                                            </td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                                {medicine.detailInformation}
                                            </td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleUpdateMedicine(medicine.id)}
                                                        className="hover:bg-blue-500 hover:text-white"
                                                    >
                                                        <PencilIcon className="size-4" />
                                                        Sửa
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleOpenDeleteModal(medicine.id)}
                                                        className="hover:bg-red-500 hover:text-white"
                                                    >
                                                        <TrashIcon className="size-4" />
                                                        Xóa
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredMedicines.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                Không tìm thấy thuốc nào
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Trang trước
                            </button>
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Trang sau
                            </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Hiển thị <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> đến{" "}
                                    <span className="font-medium">
                                        {Math.min(currentPage * itemsPerPage, totalItems)}
                                    </span>{" "}
                                    của{" "}
                                    <span className="font-medium">{totalItems}</span>{" "}
                                    kết quả
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700">Hiển thị</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={handleItemsPerPageChange}
                                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                                    >
                                        <option value="8">8</option>
                                        <option value="16">16</option>
                                        <option value="24">24</option>
                                    </select>
                                    <span className="text-sm text-gray-700">mục</span>
                                </div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                    >
                                        <span className="sr-only">Trang trước</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === page
                                                ? "z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                                : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                    >
                                        <span className="sr-only">Trang sau</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}