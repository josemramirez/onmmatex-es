import DashboardLayout from "@/components/layout/DashboardLayout";

const AdminLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <DashboardLayout isAdminMode>{children}</DashboardLayout>;
};

export default AdminLayout;
