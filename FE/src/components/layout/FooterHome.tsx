import { Phone, Mail, Info } from "lucide-react";

export default function Footer(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <footer
      className="bg-gray-900 text-gray-300 pt-14 pb-6 mt-16"
      id={props.id || "footer-contact"}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-[12rem] mb-8 px-5">
          {/* About Us */}
          <div className="md:w-1/3">
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-400" />
              Về chúng tôi
            </h3>
            <p className="text-gray-300 mb-3 leading-relaxed">
              <span className="text-blue-400 font-semibold">
                Trường THPT AAA
              </span>{" "}
              là môi trường giáo dục hiện đại, sáng tạo, nơi nuôi dưỡng và phát
              triển tài năng cho thế hệ trẻ. Chúng tôi cam kết mang đến chất
              lượng đào tạo tốt nhất với đội ngũ giáo viên giàu kinh nghiệm và
              nhiệt huyết.
            </p>
          </div>

          {/* Contact */}
          <div className="md:w-1/3">
            <h3 className="text-xl font-bold mb-6 text-white">Liên hệ</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-blue-400" />
                <p className="text-lg font-medium">(024) 1234 5678</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-blue-400" />
                <p className="text-lg font-medium">info@nguyendu.edu.vn</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:w-1/3">
            <h3 className="text-xl font-bold mb-6 text-white">
              Liên kết nhanh
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a
                  href="#blog-section"
                  className="hover:text-blue-400 transition-colors scroll-smooth"
                >
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Đăng nhập
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Bảng điều khiển
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2023 Trường THPT AAA. Bảo lưu mọi quyền.
          </p>
        </div>
      </div>
    </footer>
  );
}
