import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Loader2, Save, Github, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MemberLayout } from "@/components/layouts/MemberLayout";
import {
  useMyProfile,
  useUpdateMyProfile,
  useGitHubStatus,
  useConnectGitHub,
  useDisconnectGitHub,
} from "@/hooks/useEmployee";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const ProfilePage = () => {
  const { user } = useAuth();
  const { data: profile, isLoading: isLoadingProfile } = useMyProfile();
  const { data: githubStatus } = useGitHubStatus();
  const updateProfileMutation = useUpdateMyProfile();
  const connectGitHubMutation = useConnectGitHub();
  const disconnectGitHubMutation = useDisconnectGitHub();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form when profile loads
  if (profile && !isEditing && fullName === "") {
    setFullName(profile.full_name || "");
    setEmail(profile.email || "");
  }

  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      toast({
        title: "Validation Error",
        description: "Full name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        full_name: fullName,
      });
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    // Note: Password change endpoint may need to be implemented separately
    toast({
      title: "Info",
      description: "Password change functionality will be available soon.",
    });
  };

  const handleConnectGitHub = async () => {
    try {
      await connectGitHubMutation.mutateAsync();
      toast({
        title: "Success",
        description: "GitHub connection initiated. Please complete the authorization.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to connect GitHub.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnectGitHub = async () => {
    try {
      await disconnectGitHubMutation.mutateAsync();
      toast({
        title: "Success",
        description: "GitHub disconnected successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to disconnect GitHub.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingProfile) {
    return (
      <MemberLayout headerTitle="Profile" headerDescription="Manage your profile and account settings">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout headerTitle="Profile" headerDescription="Manage your profile and account settings">
      <div className="space-y-6 max-w-2xl">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={fullName || profile?.full_name || user?.full_name || ""}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email || profile?.email || user?.email || ""}
                onChange={(e) => setEmail(e.target.value)}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={profile?.role || user?.role || "employee"}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleUpdateProfile} disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current_password">Current Password</Label>
              <Input
                id="current_password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <Input
                id="confirm_password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleChangePassword}>
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* GitHub Connection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              GitHub Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {githubStatus?.connected ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="font-medium text-foreground">Connected</p>
                      <p className="text-sm text-muted-foreground">
                        GitHub account is connected and syncing
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleDisconnectGitHub}
                  disabled={disconnectGitHubMutation.isPending}
                >
                  {disconnectGitHubMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Disconnecting...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Disconnect GitHub
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground mb-4">
                  Connect your GitHub account to track contributions and activity.
                </p>
                <Button
                  variant="outline"
                  onClick={handleConnectGitHub}
                  disabled={connectGitHubMutation.isPending}
                >
                  {connectGitHubMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Github className="h-4 w-4 mr-2" />
                      Connect GitHub
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MemberLayout>
  );
};

export default ProfilePage;



