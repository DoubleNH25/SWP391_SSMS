import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Calendar, User, ArrowRight } from "lucide-react";
import { FetchAllBlogs } from "@/services/BlogService";
import { BlogResponse } from "@/types/Blog";

interface BlogGridProps {
  maxBlogs?: number;
  showViewAll?: boolean;
}

export default function BlogGrid({
  maxBlogs = 6,
  showViewAll = true,
}: BlogGridProps) {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Health: "bg-green-100 text-green-800",
      Nutrition: "bg-orange-100 text-orange-800",
      Activity: "bg-blue-100 text-blue-800",
      Education: "bg-purple-100 text-purple-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
          >
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded mb-4"></div>
            <div className="flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog, index) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Blog Image */}
            {blog.image && (
              <div className="h-48 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Blog Content */}
            <div className="p-6">
              {/* Category Badge */}
              {blog.category && (
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${getCategoryColor(
                    blog.category
                  )}`}
                >
                  {blog.category}
                </div>
              )}

              {/* Title */}
              <h3 className="font-bold text-lg mb-3 text-gray-900 line-clamp-2">
                {blog.title}
              </h3>

              {/* Content Preview */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {truncateContent(blog.content)}
              </p>

              {/* Meta Information */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{blog.userName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(blog.createdTime)}</span>
                </div>
              </div>

              {/* View Count and Read More */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Eye className="w-3 h-3" />
                  <span>{blog.view} lượt xem</span>
                </div>
                <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                  <span>Đọc thêm</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      {showViewAll && blogs.length >= maxBlogs && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <a
            href="/blog"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
          >
            <span>Xem tất cả bài viết</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      )}
    </div>
  );
}
