// Sidebar.tsx
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export function Sidebar() {
  return (
    <aside className="w-64 bg-white p-4 border-r h-full">
      <NavigationMenu>
        <NavigationMenuList className="flex flex-col gap-2">
          <NavigationMenuItem>
            <a href="/" className="text-sm font-medium">
              Trang chủ
            </a>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <a href="/students" className="text-sm font-medium">
              Quản lý học sinh
            </a>
          </NavigationMenuItem>
          {/* Thêm mục khác */}
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
}
