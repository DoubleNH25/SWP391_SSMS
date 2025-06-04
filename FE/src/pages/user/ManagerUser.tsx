import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/User";
import { PencilIcon, TrashBinIcon } from "../../components/icons/index"
import { useNavigate } from 'react-router-dom';
import { Modal } from "@/components/ui/modal";
import { PlusIcon } from "lucide-react";
import { FecthUsers, FecthDeleteUsers } from "@/services/UserService";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await FecthUsers();
      setUsers(fetchedUsers);
      setError(null);
    } catch (err) {
      setError(err.message.includes('authenticated')
        ? 'Please log in to view users.'
        : 'Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    navigate('/user/add-user');
  };

  const handleConfirmDeleteUser = async () => {
    if (!selectedUserId) return;
    try {
      const success = await FecthDeleteUsers(selectedUserId);
      if (success) {
        setUsers(users.filter(user => user.id !== selectedUserId));
        toast.success('User deleted successfully');
      } else {
        throw new Error('Deletion failed');
      }
      setIsDeleteModalOpen(false);
      setSelectedUserId(null);
      setError(null);
    } catch (error) {
      toast.error(`Failed to delete user: ${error.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenDeleteModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUserId(null);
  };

  const handleUpdateUser = (userId: string) => {
    navigate(`/user/update-user/${userId}`);
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
              aria-label="Log in to view users"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Log In
            </button>
          ) : (
            <button
              onClick={fetchData}
              aria-label="Retry fetching users"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          )}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center text-gray-600">No users available</div>
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
                  onClick={handleConfirmDeleteUser}
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
                <li className="text-gray-700">User</li>
              </ol>
            </nav>
            <div className="flex items-center">
              <button className="mt-4 ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                onClick={handleAddUser}
              >
                <PlusIcon className="w-4 h-4" />
                Add New User
              </button>
            </div>
          </div>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 pl-4 w-[25%]">Name</th>
                <th className="p-2  w-[30%]">Email</th>
                <th className="p-2 w-[15%]">Phone</th>
                <th className="p-2">Role</th>
                <th className="p-2 w-[20%]">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">
                    <div className="flex items-center flex-nowrap space-x-2 truncate">
                      <img src={user.imageUrl} alt="..." className="w-5 h-5 rounded-full" />
                      <span className="truncate">{user.fullName}</span>
                    </div>
                  </td>
                  <td className="p-2 truncate">{user.email}</td>
                  <td className="p-2 truncate">{user.phone}</td>
                  <td className="p-2">{user.roleName}</td>
                  <td className="p-2 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateUser(user.id)}
                    >
                      <PencilIcon className="size-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDeleteModal(user.id)}
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
