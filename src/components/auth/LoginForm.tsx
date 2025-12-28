import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TeamTuneLogo from "@/components/TeamTuneLogo";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  role: string;
  roleTitle: string;
  roleIcon: React.ReactNode;
  dashboardPath: string;
}

const LoginForm = ({ role, roleTitle, roleIcon, dashboardPath }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // TODO: Replace with actual authentication when Cloud is enabled
    // Simulating login for UI demonstration
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Authentication Required",
        description: "Please enable Lovable Cloud to complete authentication.",
      });
      // For demo purposes, navigate to dashboard
      // navigate(dashboardPath);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--muted))_1px,transparent_1px)] bg-[size:24px_24px] opacity-50" />
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <Link to="/">
          <TeamTuneLogo />
        </Link>
        <Link
          to="/auth"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Change role
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-8">
            {/* Role Badge */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
              <div className="p-3 bg-accent rounded-lg">
                {roleIcon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Logging in as</p>
                <h2 className="text-xl font-semibold text-foreground">{roleTitle}</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Need help?{" "}
            <a href="mailto:support@teamtune.io" className="text-primary hover:underline">
              Contact support
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default LoginForm;
