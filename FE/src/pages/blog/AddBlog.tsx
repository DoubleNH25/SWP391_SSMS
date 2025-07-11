import { Button } from "@/components/ui/button";
import Label from "@/components/ui/form/Label";
import { showToast } from "@/components/ui/Toast";
import { CreateBlog, UploadBlogImage } from "@/services/BlogService";
import { BlogRequest, BlogResponse } from "@/types/Blog";
import { useState } from "react";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";

export default function AddBlog() {
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null as File | null,
    titleImage: null as File | null,
  });
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const navigate = useNavigate();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleContentChange = (value: string) => {
    setFormData({ ...formData, content: value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Đã loại bỏ category, không cần xử lý
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      image: null,
      titleImage: null,
    });
  };

  // Xóa categoryLabels và các tham chiếu liên quan

  const handleCreateBlog = async () => {
    if (!formData.title || !formData.content) {
      showToast.error("Vui lòng điền đầy đủ thông tin");
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
        imageFile:formData.titleImage ?? undefined,
        // category đã bị loại bỏ
      };

      const newBlog = await CreateBlog(blogRequest);
      setBlogs((prev) => [newBlog, ...prev]);
      resetForm();
      navigate("/dashboard/blog");
      showToast.success("Tạo bài viết thành công!");
    } catch (error) {
      console.error("Error creating blog:", error);
      showToast.error("Có lỗi xảy ra khi tạo bài viết");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Tạo bài viết mới
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Chia sẻ kiến thức và kinh nghiệm của bạn với cộng đồng
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Title Field */}
              <div className="lg:col-span-2">
                <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
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
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Tiêu đề bài viết
                </Label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Nhập tiêu đề hấp dẫn cho bài viết của bạn..."
                  className="w-full h-12 px-4 rounded-xl border-2 transition-all duration-200 text-lg "
                />
                {formData.title && (
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.title.length}/100 ký tự
                  </p>
                )}
              </div>

              {/* Category Field */}
              {/* Đã loại bỏ trường category */}
            </div>

            {/* Title Image Upload */}
            <div className="mb-6">
              <Label className="block mb-2 font-semibold text-gray-700">
                Ảnh tiêu đề (titleImage)
              </Label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    titleImage: e.target.files?.[0] || null,
                  }))
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Content Editor */}
            <div className="mb-8">
              <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Nội dung bài viết
              </Label>
              <div className="rounded-lg bg-white transition-all duration-200">
                <ReactQuill
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="Bắt đầu viết nội dung bài viết của bạn... Hãy chia sẻ những kiến thức bổ ích!"
                  theme="snow"
                  modules={quillModules}
                  className="rounded-lg text-gray-800"
                  style={{
                    padding: "12px",
                    fontFamily: "Inter, system-ui, sans-serif",
                    backgroundColor: "white",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 sm:px-8 py-4">
            <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-4">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/dashboard/blog");
                    resetForm();
                  }}
                  className="hover:bg-gray-200 hover:text-black"
                >
                  Hủy
                </Button>
                <Button onClick={handleCreateBlog} disabled={formLoading}>
                  {formLoading ? "Đang xử lý..." : "Lưu"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
