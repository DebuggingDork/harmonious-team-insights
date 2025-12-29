import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Building2, 
  Users, 
  FolderKanban, 
  Plus,
  Edit,
  Archive,
  Loader2,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface Department {
  id: string;
  name: string;
  userCount: number;
  activeProjects: number;
  status: "active" | "archived";
  created_at: string;
}

const AdminDepartments = () => {
  // Mock data - replace with real API calls
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "1",
      name: "Engineering",
      userCount: 45,
      activeProjects: 12,
      status: "active",
      created_at: "2024-01-15"
    },
    {
      id: "2", 
      name: "Product Management",
      userCount: 8,
      activeProjects: 6,
      status: "active",
      created_at: "2024-01-20"
    },
    {
      id: "3",
      name: "Design",
      userCount: 12,
      activeProjects: 8,
      status: "active", 
      created_at: "2024-02-01"
    },
    {
      id: "4",
      name: "Marketing",
      userCount: 6,
      activeProjects: 3,
      status: "active",
      created_at: "2024-02-10"
    },
    {
      id: "5",
      name: "Legacy Systems",
      userCount: 2,
      activeProjects: 0,
      status: "archived",
      created_at: "2023-06-15"
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [editDepartmentName, setEditDepartmentName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const activeDepartments = departments.filter(d => d.status === "active");
  const archivedDepartments = departments.filter(d => d.status === "archived");

  const handleCreateDepartment = async () => {
    if (!newDepartmentName.trim()) {
      toast({
        title: "Validation Error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newDepartment: Department = {
        id: Date.now().toString(),
        name: newDepartmentName.trim(),
        userCount: 0,
        activeProjects: 0,
        status: "active",
        created_at: new Date().toISOString().split('T')[0]
      };

      setDepartments([...departments, newDepartment]);
      setNewDepartmentName("");
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Department created successfully",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to create department",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDepartment = async () => {
    if (!editDepartmentName.trim() || !selectedDepartment) {
      toast({
        title: "Validation Error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDepartments(departments.map(d => 
        d.id === selectedDepartment.id 
          ? { ...d, name: editDepartmentName.trim() }
          : d
      ));
      
      setEditDepartmentName("");
      setSelectedDepartment(null);
      setIsEditDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Department updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update department", 
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveDepartment = async () => {
    if (!selectedDepartment) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDepartments(departments.map(d =>
        d.id === selectedDepartment.id
          ? { ...d, status: "archived" as const }
          : d
      ));
      
      setSelectedDepartment(null);
      setIsArchiveDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Department archived successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive department",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (department: Department) => {
    setSelectedDepartment(department);
    setEditDepartmentName(department.name);
    setIsEditDialogOpen(true);
  };

  const openArchiveDialog = (department: Department) => {
    setSelectedDepartment(department);
    setIsArchiveDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Department Management</h2>
          <p className="text-muted-foreground">Organize teams and manage department structure.</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { 
            label: "Active Departments", 
            value: activeDepartments.length, 
            icon: Building2,
            color: "bg-primary/10 text-primary" 
          },
          { 
            label: "Total Users", 
            value: activeDepartments.reduce((sum, d) => sum + d.userCount, 0), 
            icon: Users,
            color: "bg-blue-500/10 text-blue-500" 
          },
          { 
            label: "Active Projects", 
            value: activeDepartments.reduce((sum, d) => sum + d.activeProjects, 0), 
            icon: FolderKanban,
            color: "bg-emerald-500/10 text-emerald-500" 
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Active Departments */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Active Departments</h3>
          <Badge variant="secondary">{activeDepartments.length} departments</Badge>
        </div>

        {activeDepartments.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No active departments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeDepartments.map((department) => (
              <div
                key={department.id}
                className="flex items-center justify-between p-4 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{department.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {department.userCount} users • {department.activeProjects} active projects
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">Active</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(department)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openArchiveDialog(department)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-warning"
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Archived Departments */}
      {archivedDepartments.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Archived Departments</h3>
            <Badge variant="outline">{archivedDepartments.length} archived</Badge>
          </div>

          <div className="space-y-3">
            {archivedDepartments.map((department) => (
              <div
                key={department.id}
                className="flex items-center justify-between p-4 bg-accent/30 rounded-lg opacity-75"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{department.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {department.userCount} users • Archived
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Archived</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Department Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Department</DialogTitle>
            <DialogDescription>
              Add a new department to organize your teams and projects.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                placeholder="Enter department name"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateDepartment}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Department"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update the department name.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Department Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter department name"
                value={editDepartmentName}
                onChange={(e) => setEditDepartmentName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditDepartment}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update Department"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Department Dialog */}
      <AlertDialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Department</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive "{selectedDepartment?.name}"? 
              This will not delete users but will mark the department as inactive. 
              This action can be reversed later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchiveDepartment}
              disabled={isLoading}
              className="bg-warning text-warning-foreground hover:bg-warning/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Archiving...
                </>
              ) : (
                "Archive Department"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default AdminDepartments;