import { Shield } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

const AdminLogin = () => {
  return (
    <LoginForm
      role="admin"
      roleTitle="Admin"
      roleIcon={<Shield className="h-6 w-6 text-primary" />}
      dashboardPath="/dashboard/admin"
    />
  );
};

export default AdminLogin;
