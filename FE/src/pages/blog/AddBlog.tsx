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
    excerpt: "",
    image: null as File | null,
    titleImage: null as File | null,
  });
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const navigate = useNavigate();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setFormData({ ...formData, title: value });
    }
  };

  const handleContentChange = (value: string) => {
    setFormData({ ...formData, content: value });
  };

  const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setFormData({ ...formData, excerpt: value });
    }
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
      excerpt: "",
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

    if (formData.title.length > 200) {
      showToast.error("Tiêu đề không được vượt quá 200 ký tự");
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
        excerpt: formData.excerpt || formData.content.replace(/<[^>]+>/g, "").slice(0, 200),
        imageUrl: imageUrl,
        imageFile: formData.titleImage ?? undefined,
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
            <div className="gap-6 mb-8">
              {/* Title Field */}
              <div>
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
                <textarea
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Nhập tiêu đề hấp dẫn cho bài viết của bạn..."
                  className="w-full h-12 px-4 rounded-xl border-2 transition-all duration-200 text-lg "
                />
                {formData.title && (
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.title.length}/200 ký tự
                  </p>
                )}
              </div>
            </div>

            {/* Excerpt Field */}
            <div className="mb-6">
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
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                Tóm tắt bài viết
              </Label>
              <textarea
                value={formData.excerpt}
                onChange={handleExcerptChange}
                placeholder="Nhập tóm tắt ngắn gọn cho bài viết (tối đa 200 ký tự)..."
                className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none"
                style={{ minHeight: "80px" }}
                rows={3}
              />
              {formData.excerpt && (
                <p className="text-sm text-gray-500 mt-2">
                  {formData.excerpt.length}/200 ký tự
                </p>
              )}
            </div>

            {/* Title Image Upload */}
            <div className="mb-6">
              <Label className="block mb-2 font-semibold text-gray-700">
                Ảnh tiêu đề
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
