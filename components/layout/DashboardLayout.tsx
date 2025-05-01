import Sidebar from "@/components/dashboard/Sidebar";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import UserProfile from "@/components/shared/UserProfile";


const DashboardLayout = ({
  children,
  isAdminMode,
}: Readonly<{ children: React.ReactNode; isAdminMode?: boolean }>) => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[200px_1fr]">
      {/* Sidebar */}
      <Sidebar isAdminMode={isAdminMode} />

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* Mobile Sidebar */}
          <MobileSidebar isAdminMode={isAdminMode} />

          <div className="w-full flex-1"></div>

          {/* User Profile Dropdown */}
          <UserProfile />

        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
