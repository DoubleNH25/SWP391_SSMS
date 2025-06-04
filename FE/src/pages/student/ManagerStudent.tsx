import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileIcon, PencilIcon, TrashBinIcon } from "../../components/icons/index"
import { useNavigate } from 'react-router-dom';
import { Modal } from "@/components/ui/modal";
import { PlusIcon } from "lucide-react";
import { FecthDeleteStudents, FecthImportUserByExcel, FecthStudents } from "@/services/UserService";
import { Student } from "@/types/Student";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function StudentManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [importMessage, setImportMessage] = useState<string>("");
  const [importLoading, setImportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const totalItems = students.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = students.slice(startIndex, endIndex);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedStudents = await FecthStudents();
      setStudents(fetchedStudents);
      setError(null);
    } catch (err) {
      setError(err.message.includes('authenticated')
        ? 'Please log in to view students.'
        : 'Failed to fetch students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    navigate('/student/add-student');
  };

  const handleConfirmDeleteStudent = async () => {
    if (!selectedStudentId) return;
    setDeleteLoading(true);
    try {
      const success = await FecthDeleteStudents(selectedStudentId);
      if (success) {
        setStudents(students.filter(user => user.id !== selectedStudentId));
        toast.success('Student deleted successfully');
      } else {
        throw new Error('Deletion failed');
      }
      setIsDeleteModalOpen(false);
      setSelectedStudentId(null);
      setError(null);
    } catch (error) {
      toast.error(`Failed to delete student: ${error.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenDeleteModal = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedStudentId(null);
  };

  const handleUpdateStudent = (studentId: string) => {
    navigate(`/student/update-student/${studentId}`);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImportMessage("");
    }
  };

  const handleImport = async () => {
    if (!file) {
      setImportMessage("Please choose file XLSX!");
      return;
    }
    setImportLoading(true);
    setImportMessage("");
    try {
      const success = await FecthImportUserByExcel(file);
      if (success) {
        const fetchedStudents = await FecthStudents();
        setStudents(fetchedStudents);
        setImportMessage("Import success!");
        toast.success('Students imported successfully');
        setIsImportModalOpen(false);
        setFile(null);
      } else {
        throw new Error('Import failed');
      }
    } catch (error) {
      setImportMessage(`Error importing file: ${error.message}`);
      toast.error(`Error importing file: ${error.message}`);
    } finally {
      setImportLoading(false);
    }
  };

  const handleOpenImportModal = () => {
    setIsImportModalOpen(true);
  };

  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
    setFile(null);
    setImportMessage("");
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
      ) : students.length === 0 ? (
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
                  onClick={handleConfirmDeleteStudent}
                  className="rounded bg-red-500 px-6 py-2 text-white hover:bg-red-600"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </Modal>
          <Modal
            isOpen={isImportModalOpen}
            onClose={handleCloseImportModal}
            showCloseButton={true}
            isFullscreen={false}
            className="max-w-md p-6"
          >
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">Import Student from XLSX</h2>
              <p className="mt-2 text-gray-600">Please select an XLSX file to import students.</p>
              <input
                type="file"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileChange}
                disabled={importLoading}
                className="mt-4"
              />
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={handleImport}
                  disabled={importLoading || !file}
                  className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
                >
                  {importLoading ? "Importing..." : "Import"}
                </button>
                <button
                  onClick={handleCloseImportModal}
                  disabled={importLoading}
                  className="rounded bg-gray-300 px-6 py-2 text-gray-900 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
              {importMessage && (
                <p
                  className={`mt-4 ${importMessage.includes("success") ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {importMessage}
                </p>
              )}
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
                <li className="text-gray-700">Student</li>
              </ol>
            </nav>
            <div className="flex items-center">
              <button className="mt-4 ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                onClick={handleAddStudent}
              >
                <PlusIcon className="w-4 h-4" />
                Add New Student
              </button>
              <button
                onClick={handleOpenImportModal}
                className="mt-4 ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2">
                <FileIcon className="w-4 h-4" />
                Import from Excel
              </button>
            </div>
          </div>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 pl-4 w-[25%]">Name</th>
                <th className="p-2 w-[10%]">Gender</th>
                <th className="p-2 w-[10%]">Date of birth</th>
                <th className="p-2 w-[10%]">Class Name</th>
                <th className="p-2 w-[10%]">Class Room</th>
                <th className="p-2 w-[15%]">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student, index) => (
                <tr key={index} className="border-t">
                  <td className="align-middle pl-2">
                    <div className="flex items-center space-x-2">
                      <img src={student.image} alt="..." className="w-8 h-8 rounded-full" />
                      <span className="truncate">{student.fullName}</span>
                    </div>
                  </td>
                  <td className="p-2 truncate">{student.gender}</td>
                  <td className="p-2 truncate">{new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}</td>
                  <td className="p-2">{student.studentClass.className}</td>
                  <td className="p-2">{student.studentClass.classRoom}</td>
                  <td className="p-2 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStudent(student.id)}
                    >
                      <PencilIcon className="size-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDeleteModal(student.id)}
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
