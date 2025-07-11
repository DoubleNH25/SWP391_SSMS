import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Eye, Plus, Pencil, Trash, UserCircle, Search, X } from "lucide-react";
import { getBlogPreview } from "@/utils/stripHtml";
import defaultBlogImg from "@/assets/images.jpg";
import { DecodeJWT } from "@/utils/DecodeJWT";
import { FetchAllBlogs, DeleteBlog } from "@/services/BlogService";
import { BlogResponse } from "@/types/Blog";
import { showToast } from "@/components/ui/Toast";
import "react-quill/dist/quill.snow.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Select from "@/components/ui/form/Select";

// Lấy thumbnail cho blog card: ưu tiên blog.image, sau đó ảnh đầu tiên trong content, cuối cùng là ảnh mặc định
function getBlogThumbnail(blog: BlogResponse) {
  if (blog.image) return blog.image;
  const match = blog.content.match(/<img[^>]+src=["']([^"'>]+)["']/i);
  if (match && match[1]) return match[1];
  return defaultBlogImg;
}

export default function Blog() {
  const location = useLocation();
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogResponse | null>(null);
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);

  // Filter, sort, search, pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<string>("newest");
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  // Category labels (reuse from AddBlog)
  // Đã loại bỏ categoryLabels

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
    { value: "views", label: "Lượt xem nhiều" },
    { value: "title", label: "Tiêu đề (A-Z)" },
  ];

  // Filtering, searching, sorting logic
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.userName.toLowerCase().includes(searchTerm.toLowerCase());
    // Loại bỏ matchesCategory
    return matchesSearch;
  });

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    switch (sortOption) {
      case "oldest":
        return (
          new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime()
        );
      case "views":
        return b.view - a.view;
      case "title":
        return a.title.localeCompare(b.title);
      case "newest":
      default:
        return (
          new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
        );
    }
  });

  // Pagination
  const totalItems = sortedBlogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedBlogs = sortedBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOption, itemsPerPage]);

  // Get current user role
  const payload = DecodeJWT();
  const userRole =
    payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const userId = payload?.sub as string;
  const isAdmin = userRole === "Admin";
  const isManager = userRole === "Manager";
  const isNurse = userRole === "Nurse";

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Tự động mở modal xem chi tiết nếu có id trên URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const blogId = params.get("id");
    if (blogId && blogs.length > 0) {
      const found = blogs.find((b) => b.id === blogId);
      if (found) {
        setSelectedBlog(found);
      }
    }
  }, [location.search, blogs]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await FetchAllBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      showToast.error("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  const handleDeleteBlog = async () => {
    if (!selectedBlog) return;

    setFormLoading(true);
    try {
      await DeleteBlog(selectedBlog.id);
      setBlogs((prev) => prev.filter((blog) => blog.id !== selectedBlog.id));
      setIsDeleteModalOpen(false);
      setSelectedBlog(null);
      showToast.success("Xóa bài viết thành công!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      showToast.error("Có lỗi xảy ra khi xóa bài viết");
    } finally {
      setFormLoading(false);
    }
  };

  const openDeleteModal = (blog: BlogResponse) => {
    setSelectedBlog(blog);
    setIsDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          {isAdmin ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
              <p className="text-gray-600 mt-1">
                Quản lý và chia sẻ thông tin sức khỏe
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-blue-700">Bài viết sức khỏe</h1>
              <p className="text-gray-600 mt-1">
                Khám phá các bài viết, kiến thức và kinh nghiệm về sức khỏe dành cho bạn
              </p>
            </>
          )}
        </div>
        {isAdmin && (
          <Button
            onClick={() => navigate("/dashboard/blog/add-blog")}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tạo bài viết
          </Button>
        )}
      </div>
      {/* Controls */}
      <div className="mb-8">
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 px-6 py-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          {/* Search */}
          <div className="flex-1">
            <label htmlFor="search" className="block text-xs font-medium text-gray-500 mb-1">Tìm kiếm</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Tìm kiếm bài viết..."
                className="block w-full rounded-lg border border-gray-200 pl-10 pr-10 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-blue-600"
                  tabIndex={-1}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          {/* Category */}
          {/* Đã loại bỏ filter category */}
          {/* Sort */}
          <div className="w-full md:w-56">
            <label htmlFor="sort" className="block text-xs font-medium text-gray-500 mb-1">Sắp xếp</label>
            <Select
              options={sortOptions}
              defaultValue={sortOption}
              onChange={setSortOption}
              className="w-full border border-gray-200 rounded-lg focus:border-blue-500 py-2.5 text-sm"
              placeholder="Sắp xếp theo"
            />
          </div>
          {/* Clear all */}
          {(searchTerm || sortOption !== "newest") && (
            <button
              onClick={() => { setSearchTerm(""); setSortOption("newest"); }}
              className="ml-auto flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors border border-gray-200"
              title="Xóa tất cả bộ lọc"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {/* Filter chips */}
        {(searchTerm) && (
          <div className="flex flex-wrap gap-2 mt-3 ml-1">
            {searchTerm && (
              <span className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200">
                <span className="mr-1">Từ khóa:</span>
                "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-2 rounded-full hover:bg-blue-100 p-0.5 text-blue-500"
                  title="Xóa từ khóa"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedBlogs.length === 0 ? (
          <div className="col-span-3 text-center py-16 text-gray-400 text-lg font-medium">
            Không tìm thấy bài viết nào.
          </div>
        ) : (
          paginatedBlogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => {
                if (isAdmin) {
                  navigate(`/blog/viewblogbyAdmin/${blog.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  navigate(`/blog/viewblog/${blog.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <img
                src={getBlogThumbnail(blog)}
                alt={blog.title}
                className="w-full h-48 object-cover object-center rounded-t-2xl"
              />
              <div className="flex-1 flex flex-col p-5">
                <div className="flex justify-between">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Eye className="w-4 h-4" />
                    <span>{blog.view}</span>
                  </div>
                </div>
                {(() => {
                  const preview = getBlogPreview(
                    truncateContent(blog.content, 120)
                  );
                  return preview ? (
                    <div className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {preview}
                    </div>
                  ) : null;
                })()}
                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <UserCircle className="w-4 h-4" />
                    <span>{blog.userName}</span>
                  </div>
                  <div className="flex gap-5">
                    {isAdmin && (
                      <Button
                        variant="outline"
                        className="hover:bg-blue-500 hover:text-white"
                        size="sm"
                        onClick={() =>
                          navigate(`/dashboard/blog/edit-blog/${blog.id}`)
                        }
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Sửa
                      </Button>
                    )}
                    {(isAdmin ||
                      isManager ||
                      (isNurse && blog.userId === userId)) && (
                      <Button
                        variant="outline"
                        className="hover:bg-red-500 hover:text-white"
                        size="sm"
                        onClick={() => openDeleteModal(blog)}
                      >
                        <Trash className="w-4 h-4 mr-1" />
                        Xóa
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 mt-8 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Hiển thị</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
            <span className="text-sm text-gray-700">mục</span>
          </div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Trang trước</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  currentPage === page
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
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      )}

      <Modal
        showCloseButton={true}
        isFullscreen={false}
        isOpen={isDeleteModalOpen}
        className="w-[30%]"
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Xác nhận xóa</h2>
          <p className="text-gray-600 mb-6">
            Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không
            thể hoàn tác.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="hover:bg-gray-200 hover:text-black"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleDeleteBlog}
              disabled={formLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {formLoading ? "Đang xử lý..." : "Xóa"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
