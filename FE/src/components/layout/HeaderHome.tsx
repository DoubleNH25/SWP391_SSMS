import { DecodeJWT } from "@/utils/DecodeJWT";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserDropdown from "../header/UserDropdown";

export function HeaderHome() {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorActive, setAnchorActive] = useState<"about" | "contact" | null>(
    null
  );

  const payload = DecodeJWT();
  const role =
    payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const isLoggedIn = !!payload && !!role;

  const handleScrollTo =
    (id: string, anchor: "about" | "contact") => (e: React.MouseEvent) => {
      e.preventDefault();
      setAnchorActive(anchor);

      if (location.pathname !== "/") {
        // Navigate về trang chủ và gửi thông tin cần scroll
        navigate("/", { state: { scrollToId: id, anchorTarget: anchor } });
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    };

  const isActive = (path: string) =>
    location.pathname === path && !anchorActive;

  return (
    <header className="fixed w-full py-4 top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-500 shadow-sm">
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center h-16">
        {/* Logo Section */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setAnchorActive(null);
            if (location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              navigate("/");
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }, 100);
            }
          }}
          className="flex items-center text-2xl font-bold text-blue-600 hover:text-blue-500 transition-all duration-500 group"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mr-4 text-white text-xl shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-500">
            🎓
          </div>
          <span className="tracking-tight">THPT AAA</span>
        </a>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center">
          <ul className="flex items-center space-x-1">
            <li>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  setAnchorActive(null);
                  if (location.pathname === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    navigate("/");
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 100);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-medium text-sm relative group transition-all duration-300 hover:bg-blue-50
                  ${
                    isActive("/")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600"
                  }
                `}
              >
                Trang Chủ
                <span
                  className={`
                  transform -translate-x-1/2 h-0.5 bg-blue-600 rounded-full transition-all duration-300
                  ${isActive("/") ? "w-6" : "w-0"}
                  group-hover:w-6
                `}
                ></span>
              </a>
            </li>
            <li>
              <a
                href="#features"
                onClick={handleScrollTo("features", "about")}
                className={`px-4 py-2 rounded-lg font-medium text-sm relative group transition-all duration-300 hover:bg-blue-50
                  ${
                    anchorActive === "about"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600"
                  }
                `}
              >
                Giới Thiệu
                <span
                  className={`
                  transform -translate-x-1/2 h-0.5 bg-blue-600 rounded-full transition-all duration-300
                  ${anchorActive === "about" ? "w-6" : "w-0"}
                  group-hover:w-6
                `}
                ></span>
              </a>
            </li>
            <li>
              <a
                href="/blog"
                onClick={(e) => {
                  e.preventDefault();
                  setAnchorActive(null);
                  navigate("/blog");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-4 py-2 rounded-lg font-medium text-sm relative group transition-all duration-300 hover:bg-blue-50
                    ${
                      isActive("/blog")
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600"
                    }
                  `}
              >
                Blog
                <span
                  className={`
                    transform -translate-x-1/2 h-0.5 bg-blue-600 rounded-full transition-all duration-300
                    ${isActive("/blog") ? "w-6" : "w-0"}
                    group-hover:w-6
                  `}
                ></span>
              </a>
            </li>
            <li>
              <a
                href="#footer-contact"
                onClick={handleScrollTo("footer-contact", "contact")}
                className={`px-4 py-2 rounded-lg font-medium text-sm relative group transition-all duration-300 hover:bg-blue-50
                  ${
                    anchorActive === "contact"
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600"
                  }
                `}
              >
                Liên Hệ
                <span
                  className={`
                  transform -translate-x-1/2 h-0.5 bg-blue-600 rounded-full transition-all duration-300
                  ${anchorActive === "contact" ? "w-6" : "w-0"}
                  group-hover:w-6
                `}
                ></span>
              </a>
            </li>
            {isLoggedIn && (
              <li>
                <a
                  href="/dashboard"
                  onClick={(e) => {
                    e.preventDefault();
                    setAnchorActive(null);
                    navigate("/dashboard");
                  }}
                  className={`px-4 py-2 rounded-lg font-medium text-sm relative group transition-all duration-300 hover:bg-blue-50
                    ${
                      location.pathname === "/dashboard" && !anchorActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600"
                    }
                  `}
                >
                  Dashboard
                  <span
                    className={`
                     transform -translate-x-1/2 h-0.5 bg-blue-600 rounded-full transition-all duration-300
                    ${
                      location.pathname === "/dashboard" && !anchorActive
                        ? "w-6"
                        : "w-0"
                    }
                    group-hover:w-6
                  `}
                  ></span>
                </a>
              </li>
            )}
          </ul>

          {/* Login/User Section */}
          <div className="ml-6 pl-6 border-gray-200">
            {!isLoggedIn ? (
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  setAnchorActive(null);
                  navigate("/login");
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl font-medium hover:from-blue-500 hover:to-blue-600 hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md"
                id="loginBtn"
              >
                Đăng Nhập
              </a>
            ) : (
              <UserDropdown />
            )}
          </div>
        </nav>

        {/* Mobile Menu Button (placeholder for future implementation) */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
