import { User } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

const MemberLogin = () => {
  return (
    <LoginForm
      role="employee"
      roleTitle="Member"
      roleIcon={<User className="h-6 w-6 text-primary" />}
      dashboardPath="/dashboard/member"
    />
  );
};

export default MemberLogin;
