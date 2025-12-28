import { Users } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

const TeamLeadLogin = () => {
  return (
    <LoginForm
      role="team_lead"
      roleTitle="Team Lead"
      roleIcon={<Users className="h-6 w-6 text-primary" />}
      dashboardPath="/dashboard/team-lead"
    />
  );
};

export default TeamLeadLogin;
