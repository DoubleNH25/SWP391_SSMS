import { Outlet } from "react-router-dom";
import { HeaderHome } from "./HeaderHome";
import Footer from "./FooterHome";

export default function HomeLayout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <HeaderHome />
      <main className="flex-1 pt-[80px]">
        {" "}
        {/* Để tránh header fixed che */}
        <Outlet />
      </main>
      <Footer id="footer-contact" />
    </div>
  );
}
