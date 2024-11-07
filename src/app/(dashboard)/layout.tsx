import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:flex-col md:fixed md:w-72 md:inset-y-0 z-[80] bg-gray-900">
        <div>
          <Sidebar/>
        </div>
      </div>
      <main className="md:pl-72">
        <div>
          <Navbar />
          {children}
        </div>
      </main>
    </div>
  )
}