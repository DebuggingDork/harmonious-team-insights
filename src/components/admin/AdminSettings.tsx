import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Settings, 
  Building, 
  Mail, 
  Shield, 
  Github, 
  Slack, 
  Zap,
  Save,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<any>(null);

  // Organization Settings
  const [orgSettings, setOrgSettings] = useState({
    name: "TeamTune Organization",
    description: "A collaborative platform for team management and project tracking",
    allowedDomains: "company.com, teamtune.com",
    maxUsers: "500",
    timezone: "UTC-8 (Pacific Time)"
  });

  // Authentication Settings
  const [authSettings, setAuthSettings] = useState({
    requireEmailVerification: true,
    passwordMinLength: 8,
    sessionTimeout: 24,
    twoFactorEnabled: false
  });

  // Integration Settings
  const [integrations, setIntegrations] = useState([
    {
      id: "github",
      name: "GitHub",
      description: "Connect repositories and track commits",
      icon: Github,
      status: "connected",
      lastSync: "2024-12-29T10:30:00Z",
      config: {
        organization: "teamtune-org",
        repositories: 12
      }
    },
    {
      id: "slack",
      name: "Slack",
      description: "Team communication and notifications",
      icon: Slack,
      status: "disconnected",
      lastSync: null,
      config: null
    },
    {
      id: "jira",
      name: "Jira",
      description: "Issue tracking and project management",
      icon: Zap,
      status: "pending",
      lastSync: null,
      config: null
    }
  ]);

  const handleSaveSettings = (settingsType: string, newSettings: any) => {
    setPendingChanges({ type: settingsType, settings: newSettings });
    setIsConfirmDialogOpen(true);
  };

  const confirmSaveSettings = async () => {
    if (!pendingChanges) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      switch (pendingChanges.type) {
        case "organization":
          setOrgSettings(pendingChanges.settings);
          break;
        case "authentication":
          setAuthSettings(pendingChanges.settings);
          break;
      }

      toast({
        title: "Settings Updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsConfirmDialogOpen(false);
      setPendingChanges(null);
    }
  };

  const getIntegrationStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-emerald-500/10 text-emerald-500">Connected</Badge>;
      case "disconnected":
        return <Badge variant="outline">Disconnected</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getIntegrationIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "disconnected":
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      case "pending":
        return <Loader2 className="h-4 w-4 text-warning animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
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
        <h2 className="text-2xl font-bold text-foreground mb-2">System Settings</h2>
        <p className="text-muted-foreground">
          Configure organization-level settings and integrations.
        </p>
      </div>

      {/* Organization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Organization Settings
          </CardTitle>
          <CardDescription>
            Basic organization information and configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                value={orgSettings.name}
                onChange={(e) => setOrgSettings({...orgSettings, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={orgSettings.timezone}
                onChange={(e) => setOrgSettings({...orgSettings, timezone: e.target.value})}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="org-description">Description</Label>
            <Textarea
              id="org-description"
              value={orgSettings.description}
              onChange={(e) => setOrgSettings({...orgSettings, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="allowed-domains">Allowed Email Domains</Label>
              <Input
                id="allowed-domains"
                value={orgSettings.allowedDomains}
                onChange={(e) => setOrgSettings({...orgSettings, allowedDomains: e.target.value})}
                placeholder="company.com, example.org"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-users">Maximum Users</Label>
              <Input
                id="max-users"
                value={orgSettings.maxUsers}
                onChange={(e) => setOrgSettings({...orgSettings, maxUsers: e.target.value})}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={() => handleSaveSettings("organization", orgSettings)}
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Organization Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Authentication Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentication & Security
          </CardTitle>
          <CardDescription>
            Security policies and authentication configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Verification Required</Label>
                  <p className="text-sm text-muted-foreground">Require users to verify their email</p>
                </div>
                <Switch
                  checked={authSettings.requireEmailVerification}
                  onCheckedChange={(checked) => 
                    setAuthSettings({...authSettings, requireEmailVerification: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Enable 2FA for enhanced security</p>
                </div>
                <Switch
                  checked={authSettings.twoFactorEnabled}
                  onCheckedChange={(checked) => 
                    setAuthSettings({...authSettings, twoFactorEnabled: checked})
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password-length">Minimum Password Length</Label>
                <Input
                  id="password-length"
                  type="number"
                  value={authSettings.passwordMinLength}
                  onChange={(e) => 
                    setAuthSettings({...authSettings, passwordMinLength: parseInt(e.target.value)})
                  }
                  min="6"
                  max="32"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (hours)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={authSettings.sessionTimeout}
                  onChange={(e) => 
                    setAuthSettings({...authSettings, sessionTimeout: parseInt(e.target.value)})
                  }
                  min="1"
                  max="168"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={() => handleSaveSettings("authentication", authSettings)}
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Security Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Integrations
          </CardTitle>
          <CardDescription>
            Connect external services and tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-accent rounded-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{integration.name}</h4>
                        {getIntegrationIcon(integration.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                      {integration.config && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {integration.id === "github" && 
                            `${integration.config.repositories} repositories in ${integration.config.organization}`
                          }
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getIntegrationStatusBadge(integration.status)}
                    <Button variant="outline" size="sm" className="gap-2">
                      {integration.status === "connected" ? "Configure" : "Connect"}
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Read-only system configuration and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Version</Label>
              <p className="text-sm font-medium">TeamTune v2.1.0</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Environment</Label>
              <p className="text-sm font-medium">Production</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Last Updated</Label>
              <p className="text-sm font-medium">Dec 29, 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Settings Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save these settings? Some changes may require users to re-authenticate or may affect system behavior.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSaveSettings}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default AdminSettings;