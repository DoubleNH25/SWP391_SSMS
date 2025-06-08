import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashBinIcon } from "../../components/icons/index"
import { useNavigate } from 'react-router-dom';
import { Modal } from "@/components/ui/modal";
import { PlusIcon } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SchoolClass } from "@/types/SchoolClass";
import { FecthClass, FecthDeleteSchoolClass } from "@/services/SchoolClassService";

export default function CLassSchoolManager() {
  const [schoolClass, setSchoolClass] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchoolClassId, setSelectedSchoolClassId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const totalItems = schoolClass.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = schoolClass.slice(startIndex, endIndex);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await FecthClass();
      setSchoolClass(data);
      setError(null);
    } catch (err ) {
      setError(err.message.includes('authenticated')
        ? 'Please log in to view class.'
        : 'Failed to fetch class. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = () => {
    navigate('/class/add-class');
  };

  const handleConfirmDeleteSchoolCLass = async () => {
    if (!selectedSchoolClassId) return;
    setDeleteLoading(true);
    try {
      const success = await FecthDeleteSchoolClass(selectedSchoolClassId);
      if (success) {
        setSchoolClass(schoolClass.filter(SchoolClass => SchoolClass.id !== selectedSchoolClassId));
        toast.success('Class deleted successfully');
      } else {
        throw new Error('Deletion failed');
      }
      setIsDeleteModalOpen(false);
      setSelectedSchoolClassId(null);
      setError(null);
    } catch (error ) {
      toast.error(`Failed to delete class: ${error.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenDeleteModal = (schoolClassId: string) => {
    setSelectedSchoolClassId(schoolClassId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSchoolClassId(null);
  };

  const handleUpdateSchoolClass = (schoolClassId: string) => {
    navigate(`/class/update-class/${schoolClassId}`);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div role="alert" className="text-center text-red-500 p-4 bg-red-100 rounded">
          <p>{error}</p>
          {error.includes('authenticated') ? (
            <button
              onClick={() => window.location.href = '/login'}
              aria-label="Log in to view students"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Log In
            </button>
          ) : (
            <button
              onClick={fetchData}
              aria-label="Retry fetching students"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          )}
        </div>
      ) : schoolClass.length === 0 ? (
        <div className="text-center text-gray-600">No students available</div>
      ) : (
        <div className="space-y-6">
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            showCloseButton={true}
            isFullscreen={false}
            className="max-w-md p-6"
          >
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Confirm Deletion
              </h2>
              <p className="mt-2 text-gray-600">
                Are you sure you want to delete this item? This action cannot be
                undone.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={handleConfirmDeleteSchoolCLass}
                  className="rounded bg-red-500 px-6 py-2 text-white hover:bg-red-600"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </Modal>
          <div className="flex items-center justify-between">
            <nav className="text-base text-gray-500 mb-4 mt-4">
              <ol className="list-reset flex">
                <li><span className="mx-2">›</span></li>
                <li>
                  Dashboard
                </li>
                <li><span className="mx-2">›</span></li>
                <li className="text-gray-700">Class</li>
              </ol>
            </nav>
            <div className="flex items-center">
              <button className="mt-4 ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                onClick={handleAddClass}
              >
                <PlusIcon className="w-4 h-4" />
                Add New Class
              </button>
            </div>
          </div>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 pl-4 w-[25%]">Name</th>
                <th className="p-2 w-[10%]">Room</th>
                <th className="p-2 w-[10%]">Quantity</th>
                <th className="p-2 w-[15%]">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((SchoolClass, index) => (
                <tr key={index} className="border-t">
                  <td className="align-middle pl-2">
                    <div className="flex items-center space-x-2">
                      <span className="truncate">{SchoolClass.className}</span>
                    </div>
                  </td>
                  <td className="p-2 truncate">{SchoolClass.classRoom}</td>
                  <td className="p-2">{SchoolClass.quantity}</td>
                  <td className="p-2 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateSchoolClass(SchoolClass.id)}
                    >
                      <PencilIcon className="size-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDeleteModal(SchoolClass.id)}
                    >
                      <TrashBinIcon className="size-4" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{" "}
                <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div className="flex gap-4 ">
              <div className="flex items-center  gap-2">
                <span className="text-sm">Show:</span>
                <select
                  className="text-sm border rounded px-2 py-1 hover:bg-gray-100"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
              <nav className="flex items-center gap-1">
                <button
                  className="px-2 py-1 text-gray-400 border rounded-r hover:bg-gray-50 disabled:opacity-50"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <svg className="size-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`px-4 py-1 text-sm font-semibold border ${page === currentPage
                      ? "bg-indigo-600 text-white"
                      : "text-gray-900 hover:bg-gray-50"
                      }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="px-2 py-1 text-gray-400 border rounded-r hover:bg-gray-50 disabled:opacity-50"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <svg className="size-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
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
  );
}
