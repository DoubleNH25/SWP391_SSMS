import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, Calendar, User } from "lucide-react";
import { FetchAllBlogs } from "@/services/BlogService";
import { BlogResponse } from "@/types/Blog";
import defaultBlogImg from "@/assets/images.jpg";
import { getBlogPreview } from "@/utils/stripHtml";
import { useNavigate } from "react-router-dom";

interface BlogFlashCardProps {
  autoPlayInterval?: number; // Thời gian tự động chuyển (ms)
  maxBlogs?: number; // Số lượng blog tối đa hiển thị
}

// Lấy thumbnail cho blog card: ưu tiên blog.image, sau đó ảnh đầu tiên trong content, cuối cùng là ảnh mặc định
function getBlogThumbnail(blog: BlogResponse) {
  if (blog.image) return blog.image;
  const match = blog.content.match(/<img[^>]+src=["']([^"'>]+)["']/i);
  if (match && match[1]) return match[1];
  return defaultBlogImg;
}

export default function BlogFlashCard({
  autoPlayInterval = 5000,
  maxBlogs = 5,
}: BlogFlashCardProps) {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (blogs.length > 1) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % blogs.length);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [blogs.length, autoPlayInterval]);

  const fetchBlogs = async () => {
    try {
      const data = await FetchAllBlogs();
      // Lọc và sắp xếp theo thời gian tạo mới nhất, giới hạn số lượng
      const sortedBlogs = data
        .sort(
          (a, b) =>
            new Date(b.createdTime).getTime() -
            new Date(a.createdTime).getTime()
        )
        .slice(0, maxBlogs);
      setBlogs(sortedBlogs);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % blogs.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + blogs.length) % blogs.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Chưa có bài viết nào</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main Flash Card */}
      <div
        className="relative h-96 overflow-hidden rounded-2xl shadow-2xl cursor-pointer"
        onClick={() => {
          const blogId = blogs?.[currentIndex]?.id;
          if (blogId) {
            navigate(`blog/viewblog/${blogId}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        title="Xem chi tiết bài viết"
      >
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{
              opacity: 0,
              x: direction === 1 ? 300 : -300,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: direction === 1 ? -300 : 300,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="absolute inset-0"
          >
            <div className="relative h-full bg-gradient-to-br from-blue-600 to-blue-800 text-white">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={getBlogThumbnail(blogs[currentIndex])}
                  alt={blogs[currentIndex].title}
                  className="w-full h-full object-cover opacity-20"
                />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Card Content */}
              <div className="relative h-full flex flex-col justify-end p-8">
                {/* Category Badge */}
                {blogs[currentIndex].category && (
                  <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-4 w-fit">
                    {blogs[currentIndex].category}
                  </div>
                )}

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                  {blogs[currentIndex].title}
                </h3>

                {/* Content Preview */}
                {(() => {
                  const preview = getBlogPreview(blogs[currentIndex].content);
                  return preview ? (
                    <p className="text-white/90 text-lg mb-6 leading-relaxed">
                      {preview}
                    </p>
                  ) : (
                    <p className="italic text-white/80 text-lg mb-6 leading-relaxed">
                      [Bài viết chỉ có hình ảnh]
                    </p>
                  );
                })()}

                {/* Meta Information */}
                <div className="flex items-center justify-between text-white/80 text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{blogs[currentIndex].userName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(blogs[currentIndex].createdTime)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{blogs[currentIndex].view} lượt xem</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      {blogs.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {blogs.length > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {blogs.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-blue-600 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
