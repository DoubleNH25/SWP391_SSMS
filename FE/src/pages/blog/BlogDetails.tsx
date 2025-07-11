import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FetchBlogById } from "@/services/BlogService";
import { BlogResponse } from "@/types/Blog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, UserCircle, Calendar } from "lucide-react";
import { DateUtils } from "@/utils/DateUtils";

export default function BlogDetails() {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    fetchData();
  }, [blogId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(Math.max(progress, 0), 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchData = async () => {
    if (!blogId) return;
    try {
      const data = await FetchBlogById(blogId);
      setBlog(data);
    } catch (error) {
      console.error("Lỗi khi tải blog:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">📄</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Không tìm thấy bài viết
          </h2>
          <p className="text-gray-500 mb-6">
            Bài viết có thể đã bị xóa hoặc không tồn tại.
          </p>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 to-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150 ease-out rounded-r-full"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full bg-white/80 border border-gray-200 shadow hover:bg-blue-50 transition px-4 py-2 flex items-center gap-2 text-blue-700 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
        </div>
        <article className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fadein">
          {/* Cover Image */}
          {blog.image && (
            <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
              <img
                src={blog.image}
                alt="Ảnh blog"
                className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}
          <div className="p-6 sm:p-10 md:p-14">
            {/* Category badge */}
            {/* Đã loại bỏ badge category */}
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>
            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-lg text-gray-600 mb-6 font-medium max-w-2xl">
                {blog.excerpt}
              </p>
            )}
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 mb-10 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <UserCircle className="w-6 h-6 text-blue-400" />
                <span className="font-semibold">{blog.userName}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar className="w-5 h-5" />
                <span>{DateUtils.customFormatDateOnly(blog.createdTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Eye className="w-5 h-5" />
                <span>{blog.view} lượt xem</span>
              </div>
            </div>
            {/* Blog content */}
            <div
              className="prose prose-lg max-w-none text-gray-900 leading-relaxed
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ul:text-gray-700 prose-ol:text-gray-700
                prose-li:text-gray-700 prose-li:leading-relaxed
                prose-blockquote:border-l-4 prose-blockquote:border-blue-200 
                prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4
                prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:text-gray-100"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>
        {/* Bottom spacing */}
        <div className="h-16"></div>
      </div>
    </div>
  );
}
