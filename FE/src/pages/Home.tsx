import Footer from "@/components/layout/FooterHome";
import { HeaderHome } from "@/components/layout/HeaderHome";
import { motion } from "framer-motion";

const features = [
  {
    icon: "🩺",
    title: "Hồ sơ sức khỏe học sinh",
    desc: "Quản lý, tra cứu thông tin sức khỏe, tiêm chủng, bệnh sử của từng học sinh.",
  },
  {
    icon: "🚑",
    title: "Sự cố y tế & cấp cứu",
    desc: "Ghi nhận, xử lý và theo dõi các sự cố y tế, hỗ trợ phản ứng nhanh.",
  },
  {
    icon: "💊",
    title: "Đơn thuốc & lịch sử dùng thuốc",
    desc: "Quản lý đơn thuốc, lịch sử cấp phát thuốc, nhắc nhở uống thuốc.",
  },
  {
    icon: "📢",
    title: "Thông báo & tư vấn y tế",
    desc: "Gửi thông báo, tư vấn sức khỏe, kết nối phụ huynh và nhà trường.",
  },
  {
    icon: "📈",
    title: "Thống kê & báo cáo",
    desc: "Báo cáo sức khỏe toàn trường, thống kê tiêm chủng, sự cố, bệnh tật.",
  },
];

const benefits = [
  {
    icon: "⏱️",
    title: "Tiết kiệm thời gian",
    desc: "Tự động hóa quy trình, giảm tải công việc giấy tờ cho y tế trường.",
  },
  {
    icon: "🔒",
    title: "Bảo mật & an toàn",
    desc: "Dữ liệu sức khỏe được bảo vệ, chỉ người có quyền mới truy cập.",
  },
  {
    icon: "👨‍👩‍👧‍👦",
    title: "Kết nối phụ huynh",
    desc: "Phụ huynh theo dõi sức khỏe con mọi lúc, nhận thông báo tức thì.",
  },
];

export default function Home() {
  const handleScrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <HeaderHome />
      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 relative z-20">
          <motion.div
            className="space-y-7"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-blue-900">
              Hệ thống <span className="text-blue-600">quản lý y tế</span>{" "}
              trường học thông minh
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Kết nối nhà trường, phụ huynh và y tế – Bảo vệ sức khỏe học sinh
              toàn diện, hiện đại và an toàn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/dashboard"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                Trải nghiệm ngay
              </a>
              <a
                href="#features"
                onClick={handleScrollTo("features")}
                className="text-blue-700 font-semibold px-8 py-4 rounded-xl border border-blue-200 hover:bg-blue-50 transition-all duration-300"
              >
                Xem chức năng
              </a>
            </div>
          </motion.div>
          <motion.div
            className="flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          >
            <div className="w-80 h-80 lg:w-[420px] lg:h-[420px] bg-gradient-to-br from-blue-400 to-blue-200 rounded-[2.5rem] flex flex-col items-center justify-center text-[5rem] lg:text-[7rem] text-white shadow-2xl select-none">
              <span className="mb-2">🩺</span>
              <span className="text-2xl font-bold">Y TẾ TRƯỜNG HỌC</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section: Chức năng nổi bật */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-blue-700">
            Chức năng nổi bật
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="bg-blue-50 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-blue-700">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Lợi ích */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-blue-700">
            Lợi ích khi sử dụng hệ thống
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-blue-700">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: CTA Đăng nhập */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center rounded-3xl shadow-xl py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-700">
            Sẵn sàng trải nghiệm?
          </h2>
          <p className="text-gray-600 mb-6">
            Đăng nhập để bắt đầu quản lý y tế trường học một cách thông minh,
            hiệu quả và an toàn!
          </p>
          <a
            href="/login"
            className="bg-blue-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all"
          >
            Đăng nhập
          </a>
        </div>
      </section>

      <Footer id="footer-contact" />
    </div>
  );
}
