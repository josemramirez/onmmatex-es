import DashboardLayout from "@/components/layout/DashboardLayout";

const UserLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default UserLayout;
