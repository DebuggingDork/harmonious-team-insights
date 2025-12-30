import AdminDepartments from "@/components/admin/AdminDepartments";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { motion } from "framer-motion";

const DepartmentsPage = () => {
  return (
    <AdminLayout
      headerTitle="Departments"
      headerDescription="Manage and organize departments within your organization."
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AdminDepartments />
      </motion.div>
    </AdminLayout>
  );
};

export default DepartmentsPage;

