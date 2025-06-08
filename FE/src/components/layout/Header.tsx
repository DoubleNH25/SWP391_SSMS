import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";



export function Header() {
  return (
    <header>
      <NavigationMenu className="w-100">
        <NavigationMenuList className="px-5">
          <NavigationMenuItem className="flex flex-nowrap px-5">
            <a href="/" className="text-sm font-medium">
              Logo
            </a>
          </NavigationMenuItem>
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
            <a href="/Login" className="text-sm font-medium">
              Login
            </a>
          </NavigationMenuItem>
          <NavigationMenuItem className="p-2 border-2 rounded-md">
            <a href="/" className="text-sm font-medium">
              Book Appointment
            </a>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuList className="px-5 mx-2">
          <NavigationMenuItem className="p-2 flex flex-nowrap">
            <span className="text-sm text-gray-500">Welcome, Admin</span>
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/100?u=admin" />
            </Avatar>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
