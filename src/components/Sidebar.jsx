'use client';

import { cn } from "@/lib/utils";
import { Code, ImageIcon, LayoutDashboard, MessageSquare, Music, Settings, VideoIcon, Heart } from "lucide-react"; // Import Heart icon
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Dashboard",
    logo: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Conversation",
    logo: MessageSquare,
    href: "/conversation",
    color: "text-violet-500",
  },
  {
    label: "Image Generation",
    logo: ImageIcon,
    href: "/image",
    color: "text-pink-500",
  },
  {
    label: "Video Generation",
    logo: VideoIcon,
    href: "/video",
    color: "text-orange-500",
  },
  {
    label: "Music Generation",
    logo: Music,
    href: "/music",
    color: "text-emerald-500",
  },
  {
    label: "Code Generation",
    logo: Code,
    href: "/code",
    color: "text-green-500",
  },
  // {
  //   label: "Medical Chat Bot",
  //   logo: Heart, 
  //   href: "/medical", 
  //   color: "text-red-500", 
  // },
  // {
  //   label: "Settings",
  //   logo: Settings,
  //   href: "/setting",
  // },
];

function Sidebar() {
  const pathname = usePathname(); // Get current pathname

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        {/* Logo Section */}
        <Link href="/dashboard" className="flex justify-center items-center mb-14">
          <div className="relative w-32 h-12">
            <Image
              alt="Mobantica Logo"
              src="https://mobantica.com/wp-content/uploads/2023/03/Frame-5954-1024x844.png"
              width={75}
              height={50}
              className="object-contain"
            />
          </div>
        </Link>

        {/* Routes Section */}
        <div className="space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href; 

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-700",
                  isActive ? "bg-gray-700" : ""
                )}
              >
                <route.logo className={`${route.color} w-5 h-5`} />
                <span className="text-sm font-medium">{route.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
