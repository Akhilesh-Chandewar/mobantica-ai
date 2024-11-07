import { UserButton } from "@clerk/nextjs";
import MobileNavbar from "@/components/MobileNavbar"

function Navbar() {
  return (
    <div className="flex items-center justify-between p-4">
     <MobileNavbar/>
      <div className="ml-auto">
        <UserButton />
      </div>
    </div>
  );
}

export default Navbar;
