import Footer from "@/components/layout/FooterHome";
import { HeaderHome } from "@/components/layout/HeaderHome";
import { motion } from "framer-motion";

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
      <section className="min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 relative z-20">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Nơi ươm mầm <span className="text-blue-600">tài năng</span> tương
              lai
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Trường THPT AAA - Môi trường học tập hiện đại, chất lượng giáo dục
              hàng đầu, đào tạo thế hệ học sinh toàn diện và sáng tạo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#footer-contact"
                onClick={handleScrollTo("footer-contact")}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                Liên hệ tư vấn
              </a>
            </div>
          </motion.div>
          <motion.div
            className="flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          >
            <div className="hover:shadow-xl shadow-none w-80 h-80 lg:w-[420px] lg:h-[420px] hover:-translate-y-1 bg-gradient-to-br from-blue-600 to-blue-400 rounded-[2.5rem] flex items-center justify-center text-[7rem] lg:text-[9rem] text-white shadow-2xl select-none transition-all duration-300">
              🏫
            </div>
          </motion.div>
        </div>
      </section>
      <Footer id="footer-contact" />
    </div>
  );
}
