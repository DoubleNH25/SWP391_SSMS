import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
      <h1 className="text-xl font-semibold">School Health Management</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">Welcome, Admin</span>
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/100?u=admin" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
