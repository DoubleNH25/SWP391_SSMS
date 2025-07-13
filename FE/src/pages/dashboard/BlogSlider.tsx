import { useEffect, useState } from "react";
import { BlogResponse } from "@/types/Blog";
import { FetchAllBlogs } from "@/services/BlogService";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const BlogSlider = () => {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await FetchAllBlogs();
        const sorted = data
          .sort(
            (a, b) =>
              new Date(b.createdTime).getTime() -
              new Date(a.createdTime).getTime()
          ) // sắp xếp mới nhất trước
          .slice(0, 7);
        setBlogs(sorted);
      } catch (error) {
        console.error("Không thể tải danh sách bài viết:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (blogs.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
      }, 5000); // Chuyển slide sau mỗi 5 giây

      return () => clearInterval(timer);
    }
  }, [blogs]);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + blogs.length) % blogs.length
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center text-gray-500">Không có bài viết nào.</div>
    );
  }

  return (
    <div className="relative h-[300px] group">
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        {blogs[currentIndex]?.image && (
          <img
            src={blogs[currentIndex].image}
            alt={blogs[currentIndex].title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-semibold line-clamp-2">
            {blogs[currentIndex]?.title}
          </h3>
        </div>
      </div>

      <button
        onClick={goToPrevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={goToNextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {blogs.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-4" : "bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogSlider;
