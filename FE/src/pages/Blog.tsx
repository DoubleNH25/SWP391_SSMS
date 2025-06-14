import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  PlusIcon,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  User,
  Search,
  Filter,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageHeader from "@/components/ui/PageHeader";
import { DecodeJWT } from "@/utils/DecodeJWT";

interface Blog {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  authorName: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  category?: string;
}

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Health",
    image: null as File | null,
  });
  const [formLoading, setFormLoading] = useState(false);

  // Get current user role
  const payload = DecodeJWT();
  const userRole =
    payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const userId = payload?.sub as string;
  const isAdmin = userRole === "Admin";
  const isManager = userRole === "Manager";
  const isNurse = userRole === "Nurse";
  const canCreateBlog = isAdmin || isManager || isNurse;

  // Mock data for development - replace with actual API calls
  const mockBlogs: Blog[] = [
    {
      id: "1",
      title: "Tầm quan trọng của việc tiêm chủng định kỳ cho trẻ em",
      content:
        "Tiêm chủng là một trong những biện pháp phòng ngừa bệnh tật hiệu quả nhất cho trẻ em. Việc tiêm chủng đúng lịch giúp bảo vệ trẻ khỏi nhiều bệnh nguy hiểm như bại liệt, ho gà, sởi, rubella và nhiều bệnh truyền nhiễm khác. Các nghiên cứu khoa học đã chứng minh rằng vaccine không chỉ bảo vệ trẻ được tiêm mà còn tạo ra hiệu ứng miễn dịch cộng đồng, giúp bảo vệ những người không thể tiêm chủng do các lý do y tế.",
      imageUrl:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
      authorName: "Dr. Nguyễn Văn A",
      authorId: "admin1",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      viewCount: 245,
      category: "Health",
    },
    {
      id: "2",
      title: "Hướng dẫn chăm sóc sức khỏe học sinh trong mùa dịch",
      content:
        "Trong bối cảnh dịch bệnh, việc bảo vệ sức khỏe học sinh là ưu tiên hàng đầu. Bài viết này sẽ hướng dẫn các biện pháp phòng ngừa và chăm sóc sức khỏe hiệu quả cho học sinh, bao gồm việc đeo khẩu trang đúng cách, rửa tay thường xuyên, giữ khoảng cách an toàn và tăng cường sức đề kháng thông qua chế độ ăn uống và tập luyện hợp lý.",
      imageUrl:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
      authorName: "Dr. Trần Thị B",
      authorId: "admin2",
      createdAt: "2024-01-10T14:20:00Z",
      updatedAt: "2024-01-10T14:20:00Z",
      viewCount: 189,
      category: "Prevention",
    },
    {
      id: "3",
      title: "Dinh dưỡng cân bằng cho học sinh tiểu học",
      content:
        "Dinh dưỡng đóng vai trò quan trọng trong sự phát triển của trẻ em. Một chế độ ăn cân bằng sẽ giúp trẻ phát triển toàn diện cả về thể chất lẫn trí tuệ. Bài viết này sẽ hướng dẫn phụ huynh cách xây dựng thực đơn dinh dưỡng phù hợp cho trẻ em tuổi tiểu học, đảm bảo cung cấp đủ các nhóm chất dinh dưỡng cần thiết.",
      imageUrl:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop",
      authorName: "Nutritionist Lê Văn C",
      authorId: "admin3",
      createdAt: "2024-01-05T09:15:00Z",
      updatedAt: "2024-01-05T09:15:00Z",
      viewCount: 156,
      category: "Nutrition",
    },
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/blogs');
      // const data = await response.json();
      // setBlogs(data);

      // Using mock data for now
      setTimeout(() => {
        setBlogs(mockBlogs);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      setLoading(false);
    }
  };

  const handleCreateBlog = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setFormLoading(true);
    try {
      // Replace with actual API call
      const authorName = isAdmin
        ? "Admin User"
        : isManager
        ? "Manager User"
        : "Nurse User";
      const newBlog: Blog = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        category: formData.category,
        imageUrl: formData.image
          ? URL.createObjectURL(formData.image)
          : undefined,
        authorName: authorName,
        authorId: userId || "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewCount: 0,
      };

      setBlogs((prev) => [newBlog, ...prev]);
      setIsCreateModalOpen(false);
      resetForm();
      toast.success("Tạo bài viết thành công!");
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Có lỗi xảy ra khi tạo bài viết");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditBlog = async () => {
    if (!selectedBlog || !formData.title || !formData.content) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setFormLoading(true);
    try {
      const updatedBlog = {
        ...selectedBlog,
        title: formData.title,
        content: formData.content,
        category: formData.category,
        updatedAt: new Date().toISOString(),
      };

      setBlogs((prev) =>
        prev.map((blog) => (blog.id === selectedBlog.id ? updatedBlog : blog))
      );
      setIsEditModalOpen(false);
      setSelectedBlog(null);
      resetForm();
      toast.success("Cập nhật bài viết thành công!");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Có lỗi xảy ra khi cập nhật bài viết");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteBlog = async () => {
    if (!selectedBlog) return;

    setFormLoading(true);
    try {
      setBlogs((prev) => prev.filter((blog) => blog.id !== selectedBlog.id));
      setIsDeleteModalOpen(false);
      setSelectedBlog(null);
      toast.success("Xóa bài viết thành công!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Có lỗi xảy ra khi xóa bài viết");
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewBlog = async (blog: Blog) => {
    try {
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === blog.id ? { ...b, viewCount: b.viewCount + 1 } : b
        )
      );
      setSelectedBlog(blog);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Failed to increment view count:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "Health",
      image: null,
    });
  };

  const openEditModal = (blog: Blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      category: blog.category || "Health",
      image: null,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsDeleteModalOpen(true);
  };

  // Filter and search blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || blog.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  const categories = [
    "all",
    "Health",
    "Prevention",
    "Nutrition",
    "Safety",
    "Education",
  ];
  const categoryLabels: { [key: string]: string } = {
    all: "Tất cả",
    Health: "Sức khỏe",
    Prevention: "Phòng ngừa",
    Nutrition: "Dinh dưỡng",
    Safety: "An toàn",
    Education: "Giáo dục",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader
        title="Blog & Tin tức"
        icon={<Edit3 className="w-6 h-6 text-blue-600" />}
        description="Chia sẻ kiến thức và thông tin về sức khỏe học sinh"
      />

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Create Button - For Admin, Manager, and Nurse */}
          {canCreateBlog && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Tạo bài viết mới
            </Button>
          )}
        </div>
      </div>

      {/* Blog Grid */}
      {paginatedBlogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            Không tìm thấy bài viết nào
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                {/* Blog Image */}
                <div className="relative h-48 bg-gray-200">
                  {blog.imageUrl ? (
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                      <Edit3 className="w-12 h-12 text-blue-400" />
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {categoryLabels[blog.category || "Health"]}
                    </span>
                  </div>

                  {/* Edit/Delete Actions - For Admin, Manager, Nurse who own the blog */}
                  {canCreateBlog && blog.authorId === userId && (
                    <div className="absolute top-3 right-3 flex gap-1">
                      <button
                        onClick={() => openEditModal(blog)}
                        className="bg-white/90 hover:bg-white text-blue-600 p-1.5 rounded-full transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(blog)}
                        className="bg-white/90 hover:bg-white text-red-600 p-1.5 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  <h3
                    className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer"
                    onClick={() => handleViewBlog(blog)}
                  >
                    {blog.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {truncateContent(blog.content)}
                  </p>

                  {/* Blog Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{blog.authorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{blog.viewCount}</span>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <Button
                    onClick={() => handleViewBlog(blog)}
                    variant="outline"
                    className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    Đọc thêm
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}

      {/* Create Blog Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        className="max-w-2xl mx-4"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Tạo bài viết mới
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tiêu đề bài viết..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories
                  .filter((cat) => cat !== "all")
                  .map((category) => (
                    <option key={category} value={category}>
                      {categoryLabels[category]}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    image: e.target.files ? e.target.files[0] : null,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Nhập nội dung bài viết..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCreateBlog}
                disabled={formLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {formLoading ? "Đang tạo..." : "Tạo bài viết"}
              </Button>
              <Button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                variant="outline"
                className="flex-1"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Blog Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBlog(null);
          resetForm();
        }}
        className="max-w-2xl mx-4"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Chỉnh sửa bài viết
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tiêu đề bài viết..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories
                  .filter((cat) => cat !== "all")
                  .map((category) => (
                    <option key={category} value={category}>
                      {categoryLabels[category]}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh mới
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    image: e.target.files ? e.target.files[0] : null,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Nhập nội dung bài viết..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleEditBlog}
                disabled={formLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {formLoading ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
              <Button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedBlog(null);
                  resetForm();
                }}
                variant="outline"
                className="flex-1"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBlog(null);
        }}
        className="max-w-md mx-4"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Xác nhận xóa</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Bạn có chắc chắn muốn xóa bài viết "{selectedBlog?.title}"? Hành
              động này không thể hoàn tác.
            </p>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleDeleteBlog}
                disabled={formLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {formLoading ? "Đang xóa..." : "Xóa"}
              </Button>
              <Button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedBlog(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* View Blog Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedBlog(null);
        }}
        className="max-w-4xl mx-4"
      >
        {selectedBlog && (
          <div className="p-6">
            <div className="space-y-6">
              {/* Blog Header */}
              <div className="text-center">
                <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {categoryLabels[selectedBlog.category || "Health"]}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedBlog.title}
                </h1>
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{selectedBlog.authorName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(selectedBlog.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{selectedBlog.viewCount} lượt xem</span>
                  </div>
                </div>
              </div>

              {/* Blog Image */}
              {selectedBlog.imageUrl && (
                <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden">
                  <img
                    src={selectedBlog.imageUrl}
                    alt={selectedBlog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Blog Content */}
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedBlog.content}
                </div>
              </div>

              {/* Blog Footer */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Cập nhật lần cuối: {formatDate(selectedBlog.updatedAt)}
                  </div>
                  {canCreateBlog && selectedBlog.authorId === userId && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setIsViewModalOpen(false);
                          openEditModal(selectedBlog);
                        }}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Chỉnh sửa
                      </Button>
                      <Button
                        onClick={() => {
                          setIsViewModalOpen(false);
                          openDeleteModal(selectedBlog);
                        }}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
