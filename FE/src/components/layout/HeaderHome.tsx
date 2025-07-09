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
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    };

  const isActive = (path: string) =>
    location.pathname === path && !anchorActive;

  return (
    <header className="fixed w-full py-3 top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center h-18">
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
          className="flex items-center text-2xl font-bold text-blue-600 hover:text-blue-500 transition-colors duration-300"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3 text-white text-xl">
            🎓
          </div>
          THPT Nguyễn Du
        </a>
        <ul className="hidden md:flex items-center space-x-8">
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
              className={`font-medium relative group transition-colors duration-300
                ${
                  isActive("/")
                    ? "text-blue-600"
                    : "text-gray-900 hover:text-blue-600"
                }
              `}
            >
              Trang Chủ
              <span
                className={`
                absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300
                ${isActive("/") ? "w-full" : "w-0"}
                group-hover:w-full
              `}
              ></span>
            </a>
          </li>
          <li>
            <a
              href="#footer-contact"
              onClick={handleScrollTo("footer-contact", "about")}
              className={`font-medium relative group transition-colors duration-300
                ${
                  anchorActive === "about"
                    ? "text-blue-600"
                    : "text-gray-900 hover:text-blue-600"
                }
              `}
            >
              Giới Thiệu
              <span
                className={`
                absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300
                ${anchorActive === "about" ? "w-full" : "w-0"}
                group-hover:w-full
              `}
              ></span>
            </a>
          </li>
          <li>
            {location.pathname === "/" ? (
              <a
                href="#blog-section"
                onClick={(e) => {
                  e.preventDefault();
                  setAnchorActive(null);
                  const el = document.getElementById("blog-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={`font-medium relative group transition-colors duration-300
                  text-gray-900 hover:text-blue-600
                `}
              >
                Blog
                <span
                  className={`
                  absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300
                  group-hover:w-full
                `}
                ></span>
              </a>
            ) : (
              <a
                href="/blog"
                onClick={(e) => {
                  e.preventDefault();
                  setAnchorActive(null);
                  navigate("/blog");
                }}
                className={`font-medium relative group transition-colors duration-300
                  ${
                    isActive("/blog")
                      ? "text-blue-600"
                      : "text-gray-900 hover:text-blue-600"
                  }
                `}
              >
                Blog
                <span
                  className={`
                  absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300
                  ${isActive("/blog") ? "w-full" : "w-0"}
                  group-hover:w-full
                `}
                ></span>
              </a>
            )}
          </li>
          <li>
            <a
              href="#footer-contact"
              onClick={handleScrollTo("footer-contact", "contact")}
              className={`font-medium relative group transition-colors duration-300
                ${
                  anchorActive === "contact"
                    ? "text-blue-600"
                    : "text-gray-900 hover:text-blue-600"
                }
              `}
            >
              Liên Hệ
              <span
                className={`
                absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300
                ${anchorActive === "contact" ? "w-full" : "w-0"}
                group-hover:w-full
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
                className={`
        font-medium relative group transition-colors duration-300
        ${
          location.pathname === "/dashboard" && !anchorActive
            ? "text-blue-600"
            : "text-gray-900 hover:text-blue-600"
        }
      `}
              >
                Dashboard
                <span
                  className={`
          absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300
          ${
            location.pathname === "/dashboard" && !anchorActive
              ? "w-full"
              : "w-0"
          }
          group-hover:w-full
        `}
                ></span>
              </a>
            </li>
          )}
          {!isLoggedIn ? (
            <li>
              <a
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  setAnchorActive(null);
                  navigate("/login");
                }}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-500 hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"
                id="loginBtn"
              >
                Đăng Nhập
              </a>
            </li>
          ) : (
            <UserDropdown />
          )}
        </ul>
      </div>
    </header>
  );
}
