import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileIcon, PencilIcon, TrashBinIcon } from "../../components/icons/index"
import { useNavigate } from 'react-router-dom';
import { Modal } from "@/components/ui/modal";
import { PlusIcon } from "lucide-react";
import { FecthDeleteStudents, FecthImportUserByExcel, FecthStudents } from "@/services/UserService";
import { Student } from "@/types/Student";

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
    const fetchedStudents = await FecthStudents();
    setStudents(fetchedStudents);
    setLoading(false);
    setError(null);
  };

  const handleAddStudent = () => {
    navigate('/student/add-student');
  };

  // const handleConfirmDeleteUser = async () => {
  //   if (!selectedUserId) return;
  //   try {
  //     await FecthDeleteUsers(selectedUserId);
  //     setUsers(users.filter(user => user.id !== selectedUserId));
  //     setIsDeleteModalOpen(false);
  //     setSelectedUserId(null);
  //     setError(null);
  //     console.log("User deleted successfully");
  //   } catch (error) {
  //     setError(`Failed to delete user: ${error.message}`);
  //   }
  // };

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

  const handleConfirmDeleteStudent = async () => {
    if (!selectedStudentId) return;
    try {
      await FecthDeleteStudents(selectedStudentId);
      setStudents(students.filter(user => user.id !== selectedStudentId));
      setIsDeleteModalOpen(false);
      setSelectedStudentId(null);
      setError(null);
    } catch (error) {
      setError(`Failed to delete user: ${error.message}`);
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
      await FecthImportUserByExcel(file);
      const fetchedStudents = await FecthStudents();
      setStudents(fetchedStudents);
      setImportMessage("Import success!");
      setIsImportModalOpen(false);
      setFile(null);
    } catch (error) {
      setImportMessage(`Error import file: ${error.message}`);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
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
              Delete
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
              className="rounded bg-gray-300 px-6 py-2 text-gray-900 hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
          {importMessage && (
            <p
              className={`mt-4 ${importMessage.includes("thành công") ? "text-green-600" : "text-red-600"
                }`}
            >
              {importMessage}
            </p>
          )}
        </div>
      </Modal>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Student Manager</h1>
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
              <td className="p-2 flex flex-nowrap truncate"><img src={student.image} alt="..." />{student.fullName}</td>
              <td className="p-2 truncate">{student.gender}</td>
              <td className="p-2 truncate">{student.dateOfBirth}</td>
              <td className="p-2">{student.schoolClass.className}</td>
              <td className="p-2">{student.schoolClass.classRoom}</td>
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
  );
}
