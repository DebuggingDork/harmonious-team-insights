import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { 
  Users, 
  Search, 
  Filter,
  UserCheck,
  UserX,
  Clock,
  Shield,
  FolderKanban,
  UsersRound,
  Loader2,
  MoreHorizontal,
  Ban,
  CheckCircle,
  CheckSquare,
  Square,
  X,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAllUsers, useBlockUser, useUnblockUser, useBulkApproveUsers, useBulkRejectUsers, useDeleteUser, useBulkDeleteUsers } from "@/hooks/useAdmin";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import type { UserRole } from "@/api/types";

const AdminUsers = () => {
  const { data: allUsers = [], isLoading } = useAllUsers();
  const blockUserMutation = useBlockUser();
  const unblockUserMutation = useUnblockUser();
  const bulkApproveMutation = useBulkApproveUsers();
  const bulkRejectMutation = useBulkRejectUsers();
  const deleteUserMutation = useDeleteUser();
  const bulkDeleteMutation = useBulkDeleteUsers();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isUnblockDialogOpen, setIsUnblockDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [isBulkApproveDialogOpen, setIsBulkApproveDialogOpen] = useState(false);
  const [isBulkRejectDialogOpen, setIsBulkRejectDialogOpen] = useState(false);
  const [bulkApproveRole, setBulkApproveRole] = useState<UserRole>("employee");
  const [bulkApproveDepartmentId, setBulkApproveDepartmentId] = useState<string>("");
  const [bulkRejectReason, setBulkRejectReason] = useState<string>("");
  const [bulkOperationResult, setBulkOperationResult] = useState<any>(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);

  const handleBlockUser = async () => {
    if (!selectedUser) return;

    try {
      await blockUserMutation.mutateAsync(selectedUser.id);
      toast({
        title: "User Blocked",
        description: `${selectedUser.full_name} has been blocked successfully`,
      });
      setIsBlockDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to block user",
        variant: "destructive",
      });
    }
  };

  const handleUnblockUser = async () => {
    if (!selectedUser) return;

    try {
      await unblockUserMutation.mutateAsync(selectedUser.id);
      toast({
        title: "User Unblocked",
        description: `${selectedUser.full_name} has been unblocked successfully`,
      });
      setIsUnblockDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unblock user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      toast({
        title: "User Deleted",
        description: `${selectedUser.full_name} has been deleted successfully`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUserIds.size === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to delete",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await bulkDeleteMutation.mutateAsync({
        user_ids: Array.from(selectedUserIds),
      });
      
      setBulkOperationResult(result);
      setIsBulkDeleteDialogOpen(false);
      setIsResultDialogOpen(true);
      setSelectedUserIds(new Set());
      setIsBulkMode(false);
      
      toast({
        title: "Bulk Deletion Complete",
        description: `Deleted ${result.total_deleted} of ${result.total_requested} users`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete users",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (user: any) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const openBlockDialog = (user: any) => {
    setSelectedUser(user);
    setIsBlockDialogOpen(true);
  };

  const openUnblockDialog = (user: any) => {
    setSelectedUser(user);
    setIsUnblockDialogOpen(true);
  };

  // Filter users based on search and filters
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get pending users for bulk operations
  const pendingUsers = useMemo(() => {
    return filteredUsers.filter(user => user.status === "pending");
  }, [filteredUsers]);

  // Get deletable users (all except admins)
  const deletableUsers = useMemo(() => {
    return filteredUsers.filter(user => user.role !== "admin");
  }, [filteredUsers]);

  // Toggle bulk mode
  const handleToggleBulkMode = () => {
    setIsBulkMode(!isBulkMode);
    if (isBulkMode) {
      // Clear selections when exiting bulk mode
      setSelectedUserIds(new Set());
    }
  };

  // Select all pending users
  const handleSelectAll = () => {
    if (selectedUserIds.size === pendingUsers.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(pendingUsers.map(u => u.id)));
    }
  };

  // Select all deletable users (for delete)
  const handleSelectAllDeletable = () => {
    if (selectedUserIds.size === deletableUsers.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(deletableUsers.map(u => u.id)));
    }
  };

  // Toggle individual user selection
  const handleToggleUser = (userId: string, userRole?: string) => {
    if (!isBulkMode) return; // Only allow selection in bulk mode
    // Don't allow selecting admin users
    if (userRole === "admin") return;
    
    const newSelected = new Set(selectedUserIds);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUserIds(newSelected);
  };

  // Handle bulk approve
  const handleBulkApprove = async () => {
    if (selectedUserIds.size === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to approve",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await bulkApproveMutation.mutateAsync({
        user_ids: Array.from(selectedUserIds),
        role: bulkApproveRole,
        department_id: bulkApproveDepartmentId || undefined,
      });
      
      setBulkOperationResult(result);
      setIsBulkApproveDialogOpen(false);
      setIsResultDialogOpen(true);
      setSelectedUserIds(new Set());
      setBulkApproveRole("employee");
      setBulkApproveDepartmentId("");
      setIsBulkMode(false); // Exit bulk mode after operation
      
      toast({
        title: "Bulk Approval Complete",
        description: `Approved ${result.total_approved} of ${result.total_requested} users`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve users",
        variant: "destructive",
      });
    }
  };

  // Handle bulk reject
  const handleBulkReject = async () => {
    if (selectedUserIds.size === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to reject",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await bulkRejectMutation.mutateAsync({
        user_ids: Array.from(selectedUserIds),
        reason: bulkRejectReason || undefined,
      });
      
      setBulkOperationResult(result);
      setIsBulkRejectDialogOpen(false);
      setIsResultDialogOpen(true);
      setSelectedUserIds(new Set());
      setBulkRejectReason("");
      setIsBulkMode(false); // Exit bulk mode after operation
      
      toast({
        title: "Bulk Rejection Complete",
        description: `Rejected ${result.total_rejected} of ${result.total_requested} users`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject users",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <UserCheck className="h-4 w-4 text-emerald-500" />;
      case "blocked": return <UserX className="h-4 w-4 text-destructive" />;
      case "pending": return <Clock className="h-4 w-4 text-warning" />;
      default: return <Users className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Shield className="h-4 w-4 text-primary" />;
      case "project_manager": return <FolderKanban className="h-4 w-4 text-blue-500" />;
      case "team_lead": return <UsersRound className="h-4 w-4 text-purple-500" />;
      default: return <Users className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "blocked": return "destructive";
      case "pending": return "secondary";
      default: return "outline";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">User Management</h2>
        <p className="text-muted-foreground">View and manage all user accounts in your organization.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="project_manager">Project Manager</SelectItem>
            <SelectItem value="team_lead">Team Lead</SelectItem>
            <SelectItem value="employee">Employee</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: allUsers.length, color: "bg-primary/10 text-primary" },
          { label: "Active", value: allUsers.filter(u => u.status === "active").length, color: "bg-emerald-500/10 text-emerald-500" },
          { label: "Pending", value: allUsers.filter(u => u.status === "pending").length, color: "bg-warning/10 text-warning" },
          { label: "Blocked", value: allUsers.filter(u => u.status === "blocked").length, color: "bg-destructive/10 text-destructive" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Bulk Actions Bar */}
      {(pendingUsers.length > 0 || deletableUsers.length > 0) && (
        <div className={`bg-card border border-border rounded-xl p-4 transition-all ${isBulkMode ? 'ring-2 ring-primary' : ''}`}>
          {!isBulkMode ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {pendingUsers.length > 0 && (
                  <Badge variant="secondary" className="text-sm">
                    {pendingUsers.length} pending {pendingUsers.length === 1 ? 'user' : 'users'}
                  </Badge>
                )}
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={handleToggleBulkMode}
                className="flex items-center gap-2"
              >
                <CheckSquare className="h-4 w-4" />
                Select Users
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  {pendingUsers.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      className="flex items-center gap-2"
                    >
                      {selectedUserIds.size === pendingUsers.length ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                      {selectedUserIds.size === pendingUsers.length ? "Deselect All Pending" : "Select All Pending"}
                    </Button>
                  )}
                  {deletableUsers.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllDeletable}
                      className="flex items-center gap-2"
                    >
                      {selectedUserIds.size === deletableUsers.length ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                      {selectedUserIds.size === deletableUsers.length ? "Deselect All" : "Select All (Non-Admin)"}
                    </Button>
                  )}
                  {selectedUserIds.size > 0 && (
                    <Badge variant="default" className="text-sm">
                      {selectedUserIds.size} {selectedUserIds.size === 1 ? 'user' : 'users'} selected
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleBulkMode}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
                {selectedUserIds.size > 0 && (
                  <div className="flex items-center gap-2">
                    {Array.from(selectedUserIds).some(id => {
                      const user = filteredUsers.find(u => u.id === id);
                      return user?.status === "pending";
                    }) && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => setIsBulkApproveDialogOpen(true)}
                          className="flex items-center gap-2"
                          disabled={bulkApproveMutation.isPending}
                        >
                          <UserCheck className="h-4 w-4" />
                          Approve ({selectedUserIds.size})
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsBulkRejectDialogOpen(true)}
                          className="flex items-center gap-2"
                          disabled={bulkRejectMutation.isPending}
                        >
                          <UserX className="h-4 w-4" />
                          Reject ({selectedUserIds.size})
                        </Button>
                      </>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setIsBulkDeleteDialogOpen(true)}
                      className="flex items-center gap-2"
                      disabled={bulkDeleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete ({selectedUserIds.size})
                    </Button>
                  </div>
                )}
              </div>
              {selectedUserIds.size === 0 && (
                <p className="text-sm text-muted-foreground">
                  Select users from the list below to perform bulk actions
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Users List */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Users</h3>
          <Badge variant="secondary">{filteredUsers.length} users</Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => {
              const isSelected = isBulkMode && user.status === "pending" && selectedUserIds.has(user.id);
              return (
              <div
                key={user.id}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  isSelected 
                    ? "bg-primary/10 border-2 border-primary" 
                    : "bg-accent/50 hover:bg-accent"
                }`}
              >
                <div className="flex items-center gap-4">
                  {isBulkMode && user.role !== "admin" && (
                    <Checkbox
                      checked={selectedUserIds.has(user.id)}
                      onCheckedChange={() => handleToggleUser(user.id, user.role)}
                    />
                  )}
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {user.full_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{user.full_name}</p>
                      {getStatusIcon(user.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {user.department && (
                      <p className="text-xs text-muted-foreground">Department: {user.department}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <Badge variant="outline" className="text-xs">
                      {user.role.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Badge variant={getStatusBadgeVariant(user.status)}>
                    {user.status}
                  </Badge>
                  {user.created_at && (
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      Joined {format(new Date(user.created_at), "MMM d, yyyy")}
                    </span>
                  )}
                  
                  {/* Actions Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user.status === "blocked" ? (
                        <DropdownMenuItem 
                          onClick={() => openUnblockDialog(user)}
                          className="text-emerald-600 focus:text-emerald-600"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Unblock User
                        </DropdownMenuItem>
                      ) : user.status === "active" ? (
                        <DropdownMenuItem 
                          onClick={() => openBlockDialog(user)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Block User
                        </DropdownMenuItem>
                      ) : null}
                      {user.role !== "admin" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => openDeleteDialog(user)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>

      {/* Block User Dialog */}
      <AlertDialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to block {selectedUser?.full_name}? This will prevent them from logging in and accessing the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBlockUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={blockUserMutation.isPending}
            >
              {blockUserMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Blocking...
                </>
              ) : (
                "Block User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unblock User Dialog */}
      <AlertDialog open={isUnblockDialogOpen} onOpenChange={setIsUnblockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unblock User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unblock {selectedUser?.full_name}? This will restore their login access and system permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnblockUser}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              disabled={unblockUserMutation.isPending}
            >
              {unblockUserMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Unblocking...
                </>
              ) : (
                "Unblock User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete {selectedUser?.full_name}? This action cannot be undone and will also remove the user from Neon Auth.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Approve Dialog */}
      <Dialog open={isBulkApproveDialogOpen} onOpenChange={setIsBulkApproveDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Bulk Approve Users</DialogTitle>
            <DialogDescription>
              Approve {selectedUserIds.size} selected user(s). You can optionally set a role and department for all users.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role (optional)</label>
              <Select value={bulkApproveRole} onValueChange={(value) => setBulkApproveRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="team_lead">Team Lead</SelectItem>
                  <SelectItem value="project_manager">Project Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Defaults to "employee" if not specified</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department ID (optional)</label>
              <Input
                placeholder="Enter department ID"
                value={bulkApproveDepartmentId}
                onChange={(e) => setBulkApproveDepartmentId(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkApproveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkApprove}
              disabled={bulkApproveMutation.isPending}
            >
              {bulkApproveMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Approving...
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Approve {selectedUserIds.size} User(s)
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Reject Dialog */}
      <Dialog open={isBulkRejectDialogOpen} onOpenChange={setIsBulkRejectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Bulk Reject Users</DialogTitle>
            <DialogDescription>
              Reject {selectedUserIds.size} selected user(s). You can optionally provide a reason for rejection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason (optional)</label>
              <Textarea
                placeholder="Enter rejection reason..."
                value={bulkRejectReason}
                onChange={(e) => setBulkRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkReject}
              disabled={bulkRejectMutation.isPending}
            >
              {bulkRejectMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Rejecting...
                </>
              ) : (
                <>
                  <UserX className="h-4 w-4 mr-2" />
                  Reject {selectedUserIds.size} User(s)
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Bulk Delete Users</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete {selectedUserIds.size} selected user(s)? This action cannot be undone and will also remove users from Neon Auth. Admin users cannot be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={bulkDeleteMutation.isPending}
            >
              {bulkDeleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete {selectedUserIds.size} User(s)
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Operation Result Dialog */}
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Bulk Operation Results</DialogTitle>
            <DialogDescription>
              Summary of the bulk operation
            </DialogDescription>
          </DialogHeader>
          {bulkOperationResult && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Requested</p>
                  <p className="text-2xl font-bold">{bulkOperationResult.total_requested}</p>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-lg">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    {bulkOperationResult.total_approved !== undefined ? "Approved" : 
                     bulkOperationResult.total_rejected !== undefined ? "Rejected" : 
                     bulkOperationResult.total_deleted !== undefined ? "Deleted" : "Processed"}
                  </p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {bulkOperationResult.total_approved ?? 
                     bulkOperationResult.total_rejected ?? 
                     bulkOperationResult.total_deleted ?? 0}
                  </p>
                </div>
              </div>
              
              {bulkOperationResult.failed && bulkOperationResult.failed.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-destructive">
                    Failed ({bulkOperationResult.total_failed})
                  </p>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 max-h-48 overflow-y-auto">
                    <div className="space-y-2">
                      {bulkOperationResult.failed.map((failure: any, index: number) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium text-destructive">User ID: {failure.user_id}</p>
                          <p className="text-muted-foreground">{failure.error}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {bulkOperationResult.approved && bulkOperationResult.approved.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Successfully Approved ({bulkOperationResult.approved.length})
                  </p>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 max-h-48 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {bulkOperationResult.approved.map((userId: any, index: number) => {
                        const userIdStr = typeof userId === 'string' ? userId : String(userId || '');
                        return (
                          <Badge key={index} variant="outline" className="text-emerald-600 dark:text-emerald-400">
                            {userIdStr.length > 8 ? `${userIdStr.substring(0, 8)}...` : userIdStr}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {bulkOperationResult.rejected && bulkOperationResult.rejected.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Successfully Rejected ({bulkOperationResult.rejected.length})
                  </p>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 max-h-48 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {bulkOperationResult.rejected.map((userId: any, index: number) => {
                        const userIdStr = typeof userId === 'string' ? userId : String(userId || '');
                        return (
                          <Badge key={index} variant="outline" className="text-emerald-600 dark:text-emerald-400">
                            {userIdStr.length > 8 ? `${userIdStr.substring(0, 8)}...` : userIdStr}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {bulkOperationResult.deleted && bulkOperationResult.deleted.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Successfully Deleted ({bulkOperationResult.deleted.length})
                  </p>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 max-h-48 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {bulkOperationResult.deleted.map((userId: any, index: number) => {
                        const userIdStr = typeof userId === 'string' ? userId : String(userId || '');
                        return (
                          <Badge key={index} variant="outline" className="text-emerald-600 dark:text-emerald-400">
                            {userIdStr.length > 8 ? `${userIdStr.substring(0, 8)}...` : userIdStr}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsResultDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminUsers;