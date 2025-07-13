import { useCallback, useEffect, useRef, useState, memo, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDownIcon,
  CalenderIcon,
  DashboardIcon,
  UserCircleIcon,
  TaskIcon,
  TimeIcon,
  HomeIcon,
  BlogIcon,
  RequestIcon,
  StethoscopeIcon,
  BackIcon,
  ListIcon,
} from "@/components/icons";
import { AlertTriangle } from "lucide-react";
import { useSidebar } from "@/components/context/sidebar";
import { DecodeJWT } from "@/utils/DecodeJWT";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  allowedRoles: string[];
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    allowedRoles: string[];
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <HomeIcon className="w-5 h-5 mx-auto scale-[0.9]" />,
    name: "Tổng quan",
    path: "/dashboard",
    allowedRoles: ["Admin", "Manager", "Nurse", "Parent"],
  },
  {
    icon: <DashboardIcon className="w-5 h-5 mx-auto scale-[1.1]" />,
    name: "Bảng điều khiển",
    allowedRoles: ["Admin", "Manager", "Nurse"],
    subItems: [
      {
        name: "Người dùng",
        path: "/dashboard/user",
        pro: false,
        allowedRoles: ["Admin"],
      },
      {
        name: "Lớp học",
        path: "/dashboard/class",
        pro: false,
        allowedRoles: ["Admin"],
      },
      {
        name: "Thuốc",
        path: "/dashboard/medical/manager-medical",
        pro: false,
        allowedRoles: ["Admin", "Manager", "Nurse"],
      },
    ],
  },
  {
    icon: <BlogIcon className="w-4 h-4 mx-auto" />,
    name: "Blog",
    path: "/dashboard/blog",
    allowedRoles: ["Admin", "Manager"],
  },
  {
    icon: <UserCircleIcon className="w-5 h-5 mx-auto" />,
    name: "Hồ sơ sức khỏe",
    path: "/dashboard/parent/health-profiles",
    allowedRoles: ["Parent"],
  },
  {
    icon: <CalenderIcon className="w-5 h-5 mx-auto" />,
    name: "Lịch",
    path: "/dashboard/calendar",
    allowedRoles: ["Admin", "Manager", "Nurse"],
  },
  {
    icon: <TaskIcon className="w-5 h-5 mx-auto" />,
    name: "Sự kiện y tế",
    allowedRoles: ["Admin", "Manager", "Nurse"],
    subItems: [
      {
        name: "Quản lý chờ duyệt",
        path: "/dashboard/pending-medical-events",
        pro: false,
        allowedRoles: ["Admin", "Manager"],
      },
      {
        name: "Lịch sử phê duyệt",
        path: "/dashboard/approved-medical-events",
        pro: false,
        allowedRoles: ["Admin", "Manager", "Nurse"],
      },
    ],
  },
  {
    icon: <StethoscopeIcon className="w-5 h-5 mx-auto scale-[0.9]" />,
    name: "Kiểm tra sức khỏe",
    path: "/dashboard/parent/health-checkup",
    allowedRoles: ["Parent"],
  },
  {
    icon: <TimeIcon className="w-5 h-5 mx-auto" />,
    name: "Lịch tư vấn",
    allowedRoles: ["Admin", "Manager", "Nurse"],
    subItems: [
      {
        name: "Quản lý lịch tư vấn",
        path: "/dashboard/conseling-schedules",
        pro: false,
        allowedRoles: ["Admin", "Manager", "Nurse"],
      },
      {
        name: "Học sinh bất thường",
        path: "/dashboard/conseling-schedules/abnormal",
        pro: false,
        allowedRoles: ["Admin", "Manager", "Nurse"],
      },
    ],
  },
  {
    icon: <RequestIcon className="w-5 h-5 mx-auto" />,
    name: "Yêu cầu thuốc",
    path: "/dashboard/medical/medical-request",
    allowedRoles: ["Admin", "Manager", "Nurse", "Parent"],
  },
  {
    icon: <AlertTriangle className="w-5 h-5 mx-auto" />,
    name: "Sự cố y tế",
    path: "/dashboard/medicalincident/manager",
    allowedRoles: ["Admin", "Manager", "Nurse", "Parent"],
  },
  {
    icon: <ListIcon className="w-5 h-5 mx-auto" />,
    name: "Xác nhận hoạt động y tế",
    path: "/dashboard/activity-medical",
    allowedRoles: ["Parent"],
  },
  {
    icon: <StethoscopeIcon className="w-5 h-5 mx-auto scale-[0.9]" />,
    name: "Thuốc học sinh",
    path: "/dashboard/medical/manager-medical-request",
    allowedRoles: ["Admin", "Manager", "Nurse"],
  },
  {
    icon: <BackIcon className="w-5 h-5 mx-auto" />,
    name: "Quay về trang chủ",
    path: "/",
    allowedRoles: ["Admin", "Manager", "Nurse", "Parent"],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const role = useMemo(() => {
    try {
      return (
        DecodeJWT()?.[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || null
      );
    } catch (err) {
      console.error("DecodeJWT failed:", err);
      return null;
    }
  }, []);

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  const filteredNavItems = useMemo(() => {
    if (!role) return [];
    return navItems
      .filter((item) => item.allowedRoles.includes(role!))
      .map((item) => ({
        ...item,
        subItems: item.subItems?.filter((subItem) =>
          subItem.allowedRoles.includes(role!)
        ),
      }))
      .filter((item) => item.subItems?.length || item.path);
  }, [role]);

  useEffect(() => {
    if (!role) {
      navigate("/login");
    }
  }, [role, navigate]);

  useEffect(() => {
    const matched = filteredNavItems.reduce(
      (acc, nav, index) =>
        nav.subItems?.some((subItem) => isActive(subItem.path))
          ? { type: "main" as const, index }
          : acc,
      null as { type: "main"; index: number } | null
    );
    setOpenSubmenu(matched);
  }, [pathname, isActive, filteredNavItems]);

  useEffect(() => {
    if (openSubmenu) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const height = subMenuRefs.current[key]?.scrollHeight || 0;
      setSubMenuHeight((prev) =>
        prev[key] === height ? prev : { ...prev, [key]: height }
      );
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = useCallback(
    (index: number, menuType: "main", event: React.MouseEvent) => {
      if (event.target instanceof HTMLAnchorElement) {
        return;
      }
      setOpenSubmenu((prev) =>
        prev?.type === menuType && prev.index === index
          ? null
          : { type: menuType, index }
      );
    },
    []
  );

  const renderMenuItems = useCallback(
    (items: NavItem[], menuType: "main") => (
      <ul className="flex flex-col gap-4 px-3">
        {items.map((nav, index) => {
          const isOpen =
            openSubmenu?.type === menuType && openSubmenu.index === index;
          const key = `${menuType}-${index}`;
          const isVisible = isExpanded || isHovered || isMobileOpen;
          const isParentActive =
            nav.subItems?.some((subItem) => isActive(subItem.path)) || false;

          return (
            <li key={nav.name}>
              {nav.subItems ? (
                <button
                  onClick={(e) => handleSubmenuToggle(index, menuType, e)}
                  className={`menu-item group w-full flex items-center px-4 py-3 rounded-lg transition-all text-[15px] font-medium
                  ${
                    isParentActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                  ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center gap-0"
                      : "lg:justify-start gap-3"
                  }`}
                >
                  <span className="flex-shrink-0 w-5 h-5">{nav.icon}</span>
                  {isVisible && (
                    <>
                      <span className="font-medium">{nav.name}</span>
                      <ChevronDownIcon
                        className={`ml-auto w-5 h-5 transition-transform duration-200
                          ${isOpen ? "rotate-180" : ""}`}
                      />
                    </>
                  )}
                </button>
              ) : (
                nav.path && (
                  <Link
                    to={nav.path}
                    className={`menu-item group flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-[15px] font-medium
                      ${
                        isActive(nav.path)
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <span className="flex-shrink-0 w-5 h-5">{nav.icon}</span>
                    {isVisible && (
                      <span className="font-medium">{nav.name}</span>
                    )}
                  </Link>
                )
              )}
              {nav.subItems && isOpen && (
                <div
                  ref={(el) => {
                    if (el) {
                      subMenuRefs.current[key] = el;
                    }
                  }}
                  style={{
                    height: subMenuHeight[key] || "auto",
                    overflow: "hidden",
                  }}
                  className="transition-all duration-200 ease-in-out"
                >
                  <ul className="pl-12 py-2 space-y-2">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.path}>
                        <Link
                          to={subItem.path}
                          className={`block py-2 px-3 rounded-lg transition-all text-[14px] font-medium
                            ${
                              isActive(subItem.path)
                                ? "text-blue-700 bg-blue-200"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    ),
    [isExpanded, isHovered, isMobileOpen, openSubmenu, subMenuHeight, isActive]
  );

  if (!role) {
    return null;
  }

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-blue-50 border-r border-gray-200 transition-all duration-300 ${
        isExpanded || isHovered ? "w-64" : "w-20"
      } ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full py-6">
        <div className="flex-1 overflow-y-auto">
          {renderMenuItems(filteredNavItems, "main")}
        </div>
      </div>
    </aside>
  );
};

export default memo(AppSidebar);
