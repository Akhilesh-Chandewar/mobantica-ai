'use client';

import { Code, Heart, ImageIcon, MessageSquare, Music, VideoIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const tools = [
  {
    label: "Conversation",
    logo: MessageSquare,
    href: "/conversation",
    color: "text-violet-500",
    bgcolor: "bg-violet-500/10",
  },
  {
    label: "Image Generation",
    logo: ImageIcon,
    href: "/image",
    color: "text-pink-500",
    bgcolor: "bg-pink-500/10",
  },
  {
    label: "Video Generation",
    logo: VideoIcon,
    href: "/video",
    color: "text-orange-500",
    bgcolor: "bg-orange-500/10",
  },
  {
    label: "Music Generation",
    logo: Music,
    href: "/music",
    color: "text-emerald-500",
    bgcolor: "bg-emerald-500/10",
  },
  {
    label: "Code Generation",
    logo: Code,
    href: "/code",
    color: "text-green-500",
    bgcolor: "bg-green-500/10",
  },
  {
    label: "Medical Chat Bot",
    logo: Heart, 
    href: "/medical", 
    color: "text-red-500", 
    bgcolor: "text-red-500/10"
  },
];

function Dashboardpage() {
  const route = useRouter()
  return (
    <div className="mb-4 space-y-4">
      <h2 className="text-2xl md:text-4xl font-bold text-center">
        Explore the Power of AI
      </h2>
      <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
        Chat with the smartest AI - Experience the power of AI
      </p>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card
            onClick={() => { route.push(tool.href) }}
            key={tool.href}
            className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transision cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgcolor)}>
                <tool.logo className={cn("h-8 w8", tool.color)} />
              </div>
              <div className="font-semibold">
                {tool.label}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Dashboardpage;
