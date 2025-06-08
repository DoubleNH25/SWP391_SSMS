import { useCallback, useEffect, useRef, useState, memo, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDownIcon, GridIcon, BoltIcon, HorizontaLDots, CalenderIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { DecodeJWT } from "@/utils/DecodeJWT";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  allowedRoles: string[];
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean; allowedRoles: string[] }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    allowedRoles: ["Admin", "Manager"],
    subItems: [
      { name: "User", path: "/user", pro: false, allowedRoles: ["Admin"] },
      { name: "Student", path: "/student", pro: false, allowedRoles: ["Admin", "Manager"] },
      { name: "Class", path: "/class", pro: false, allowedRoles: ["Admin"] },
    ],
  },
  { icon: <BoltIcon />, name: "Blog", path: "/blog", allowedRoles: ["Admin", "Manager", "Nurse", "Parent"] },
  { icon: <BoltIcon />, name: "Health Profile", path: "/parent/health-profiles", allowedRoles: ["Parent"] },
  { icon: <CalenderIcon />, name: "Calendar", path: "/calendar", allowedRoles: ["Admin", "Manager", "Nurse"] },
  {
    icon: <GridIcon />,
    name: "Medical Events",
    allowedRoles: ["Admin", "Manager", "Nurse"],
    subItems: [
      { name: "Manager Pending", path: "/pending-medical-events", pro: false, allowedRoles: ["Admin", "Manager"] },
      { name: "Approval History", path: "/approved-medical-events", pro: false, allowedRoles: ["Admin", "Manager", "Nurse"] },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const role = useMemo(() => {
    try {
      return DecodeJWT()?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
    } catch (err) {
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
        subItems: item.subItems?.filter((subItem) => subItem.allowedRoles.includes(role!)),
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
      setSubMenuHeight((prev) => (prev[key] === height ? prev : { ...prev, [key]: height }));
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = useCallback(
    (index: number, menuType: "main", event: React.MouseEvent) => {
      if (event.target instanceof HTMLAnchorElement) {
        return;
      }
      setOpenSubmenu((prev) =>
        prev?.type === menuType && prev.index === index ? null : { type: menuType, index }
      );
    },
    []
  );

  const renderMenuItems = useCallback(
    (items: NavItem[], menuType: "main") => (
      <ul className="flex flex-col gap-5">
        {items.map((nav, index) => {
          const isOpen = openSubmenu?.type === menuType && openSubmenu.index === index;
          const key = `${menuType}-${index}`;
          const isVisible = isExpanded || isHovered || isMobileOpen;
          const isParentActive = nav.subItems?.some((subItem) => isActive(subItem.path)) || false;

          return (
            <li key={nav.name}>
              {nav.subItems ? (
                <button
                  onClick={(e) => handleSubmenuToggle(index, menuType, e)}
                  className={`menu-item group w-full flex items-center gap-2 px-3 py-2 transition-all
                    ${isParentActive ? "bg-blue-200 text-blue-600 rounded-md" : "bg-transparent text-gray-700 hover:bg-gray-100"}
                    ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
                >
                  <span className="menu-item-icon-size flex-shrink-0 text-gray-500">{nav.icon}</span>
                  {isVisible && <span className="menu-item-text whitespace-nowrap">{nav.name}</span>}
                  {isVisible && (
                    <ChevronDownIcon
                      className={`ml-auto w-5 h-5 transition-transform duration-200
                        ${isOpen ? "text-gray-400" : "text-gray-400"}`}
                    />
                  )}
                </button>
              ) : (
                nav.path && (
                  <Link
                    to={nav.path}
                    className={`menu-item group flex items-center gap-2 px-3 py-2 transition-all
                      ${isActive(nav.path) ? "menu-item-active bg-blue-200 text-blue-600 rounded-md" : "menu-item-inactive"}`}
                  >
                    <span
                      className={`menu-item-icon-size flex items-center justify-center
                        ${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}
                    >
                      {nav.icon}
                    </span>
                    {isVisible && <span className="menu-item-text">{nav.name}</span>}
                  </Link>
                )
              )}
              {nav.subItems && isVisible && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[key] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{ height: isOpen ? `${subMenuHeight[key] || 0}px` : "0px" }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.name} className="p-0 rounded-md">
                        <Link
                          to={subItem.path}
                          className={`p-2 rounded-md w-full flex items-center justify-between cursor-pointer
                            ${isActive(subItem.path) ? "bg-blue-200 text-blue-600" : ""}
                            ${isActive(subItem.path) ? "menu-dropdown-item-active bg-brand-400" : "menu-dropdown-item-inactive"} menu-dropdown-item`}
                        >
                          {subItem.name}
                          <span className="flex items-center gap-1 ml-auto">
                            {subItem.new && (
                              <span
                                className={`ml-auto bg-yellow ${isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"} menu-dropdown-badge`}
                              >
                                new
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ml-auto ${isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"} menu-dropdown-badge`}
                              >
                                pro
                              </span>
                            )}
                          </span>
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
    [isExpanded, isHovered, isMobileOpen, openSubmenu, subMenuHeight, handleSubmenuToggle, isActive]
  );

  if (!role) {
    return null;
  }

  return (
    <aside
      className={`fixed mt-16 lg:mt-0 top-0 left-0 bg-white dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col mt-5 overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div className="mx-5">
              <h2
                className={`mb-4 text-md font-bold uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots className="size-6" />}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default memo(AppSidebar);