// Sidebar.tsx
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export function Sidebar() {
  return (
    <aside className="w-full h-40 bg-green-400">
      {/* ================= */}
      <NavigationMenu className="w-100 mt-5">
        <NavigationMenuList className="px-5">
          <NavigationMenuItem className="flex flex-nowrap px-5">
            <a href="/" className="text-sm font-medium">
              Logo
            </a>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuList className="px-5">
          <NavigationMenuItem className="p-2">
            <a href="/" className="text-sm font-medium">
              About Us
            </a>
          </NavigationMenuItem>
          <NavigationMenuItem className="p-2">
            <a href="/" className="text-sm font-medium">
              Treatments
            </a>
          </NavigationMenuItem>
          <NavigationMenuItem className="p-2">
            <a href="/" className="text-sm font-medium">
              Contact Us
            </a>
          </NavigationMenuItem>
          <NavigationMenuItem className="p-2">
            <a href="/" className="text-sm font-medium">
              Blog
            </a>
          </NavigationMenuItem>
          <NavigationMenuItem className="p-2 border-2 rounded-md">
            <a href="/" className="text-sm font-medium">
              Book Appointment
            </a>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
}
