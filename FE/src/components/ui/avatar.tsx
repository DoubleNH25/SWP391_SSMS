import React from "react";

export function AvatarImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img {...props} />;
}

export function AvatarFallback({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>;
}

export function Avatar(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="w-10 h-10 rounded-full bg-gray-300" {...props} />;
}
