import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Eye, Plus, Pencil, Trash, UserCircle } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DecodeJWT } from "@/utils/DecodeJWT";
import {
  FetchAllBlogs,
  CreateBlog,
  UpdateBlog,
  DeleteBlog,
  IncrementBlogView,
  UploadBlogImage,
} from "@/services/BlogService";
import { BlogResponse, BlogRequest } from "@/types/Blog";

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogResponse | null>(null);

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

  // Category labels
  const categoryLabels: Record<string, string> = {
    Health: "Sức khỏe",
    Nutrition: "Dinh dưỡng",
    Activity: "Hoạt động",
    Education: "Giáo dục",
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await FetchAllBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      toast.error("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      image: e.target.files ? e.target.files[0] : null,
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, content: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, category: e.target.value });
  };

  const handleCreateBlog = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setFormLoading(true);
    try {
      let imageUrl: string | undefined;
      if (formData.image) {
        const uploadResult = await UploadBlogImage(formData.image);
        imageUrl = uploadResult.imageUrl;
      }

      const blogRequest: BlogRequest = {
        title: formData.title,
        content: formData.content,
        imageUrl: imageUrl,
        category: formData.category,
      };

      const newBlog = await CreateBlog(blogRequest);
      const blogWithCategory = {
        ...newBlog,
        category: formData.category,
      };

      setBlogs((prev) => [blogWithCategory, ...prev]);
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
      let imageUrl: string | undefined;
      if (formData.image) {
        const uploadResult = await UploadBlogImage(formData.image);
        imageUrl = uploadResult.imageUrl;
      }

      const blogRequest: BlogRequest = {
        title: formData.title,
        content: formData.content,
        imageUrl: imageUrl,
        category: formData.category,
      };

      await UpdateBlog(selectedBlog.id, blogRequest);

      // Update local state
      const updatedBlog = {
        ...selectedBlog,
        title: formData.title,
        content: formData.content,
        image: imageUrl || selectedBlog.image,
        category: formData.category,
        updatedTime: new Date().toISOString(),
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
      await DeleteBlog(selectedBlog.id);
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

  const handleViewBlog = async (blog: BlogResponse) => {
    try {
      await IncrementBlogView(blog.id);
      setBlogs((prev) =>
        prev.map((b) => (b.id === blog.id ? { ...b, view: b.view + 1 } : b))
      );
      setSelectedBlog(blog);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Failed to increment view count:", error);
      toast.error("Có lỗi xảy ra khi cập nhật lượt xem");
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

  const openEditModal = (blog: BlogResponse) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      category: blog.category || "Health",
      image: null,
    });
    setIsEditModalOpen(true);
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
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-600 mt-1">
            Quản lý và chia sẻ thông tin sức khỏe
          </p>
        </div>
        {(isAdmin || isManager || isNurse) && (
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tạo bài viết
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Blog cards */}
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {blog.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {truncateContent(blog.content)}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <UserCircle className="w-4 h-4" />
                  <span>{blog.userName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewBlog(blog)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Xem
                  </Button>
                  {(isAdmin ||
                    isManager ||
                    (isNurse && blog.userId === userId)) && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(blog)}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Sửa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteModal(blog)}
                      >
                        <Trash className="w-4 h-4 mr-1" />
                        Xóa
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedBlog(null);
          resetForm();
        }}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {isCreateModalOpen ? "Tạo bài viết mới" : "Chỉnh sửa bài viết"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Nhập tiêu đề bài viết"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung
              </label>
              <textarea
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Nhập nội dung bài viết"
                rows={6}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục
              </label>
              <select
                value={formData.category}
                onChange={handleCategoryChange}
                className="flex h-10 w-full min-w-[180px] appearance-none items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình ảnh
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                  setSelectedBlog(null);
                  resetForm();
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={isCreateModalOpen ? handleCreateBlog : handleEditBlog}
                disabled={formLoading}
              >
                {formLoading ? "Đang xử lý..." : "Lưu"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
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

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <div className="p-6">
          {selectedBlog && (
            <div className="space-y-6">
              {selectedBlog.image && (
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {categoryLabels[selectedBlog.category || "Health"]}
                </span>
                <h2 className="text-2xl font-bold mt-4">
                  {selectedBlog.title}
                </h2>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <UserCircle className="w-4 h-4" />
                    <span>{selectedBlog.userName}</span>
                  </div>
                  <span>{formatDate(selectedBlog.createdTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{selectedBlog.view}</span>
                </div>
              </div>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{selectedBlog.content}</p>
              </div>
              {(isAdmin || isManager || isNurse) &&
                selectedBlog.userId === userId && (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsViewModalOpen(false);
                        openEditModal(selectedBlog);
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsViewModalOpen(false);
                        openDeleteModal(selectedBlog);
                      }}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Xóa
                    </Button>
                  </div>
                )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
