import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Hero } from "./Hero";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="w-full bg-green-400">
      <main className="h-40 ">
        <Header />
        <Hero />
      </main>
      
      <section className="p-6 bg-gray-50">
        {children}
      </section>
    </div>
  );
}
