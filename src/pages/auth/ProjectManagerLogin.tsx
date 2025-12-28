import { Briefcase } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

const ProjectManagerLogin = () => {
  return (
    <LoginForm
      role="project_manager"
      roleTitle="Project Manager"
      roleIcon={<Briefcase className="h-6 w-6 text-primary" />}
      dashboardPath="/dashboard/project-manager"
    />
  );
};

export default ProjectManagerLogin;
