import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, CheckCircle2, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import TeamTuneLogo from "@/components/TeamTuneLogo";

const PendingApproval = () => {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--accent))_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <TeamTuneLogo />
          </div>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              className="relative"
            >
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center">
                <Clock className="h-10 w-10 text-primary" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
              </motion.div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-3">Request Submitted</h1>
            <p className="text-muted-foreground leading-relaxed">
              Your access request has been received and is pending admin approval.
            </p>
          </div>

          {/* Status Steps */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Registration Complete</p>
                <p className="text-xs text-muted-foreground">Your information has been saved</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-accent border-2 border-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Awaiting Approval</p>
                <p className="text-xs text-muted-foreground">An admin will review your request</p>
              </div>
            </div>

            <div className="flex items-start gap-4 opacity-50">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Email Notification</p>
                <p className="text-xs text-muted-foreground">You'll be notified once approved</p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-accent/50 border border-border rounded-xl p-4 mb-8">
            <p className="text-sm text-muted-foreground text-center">
              This process typically takes <span className="font-medium text-foreground">1-2 business days</span>. 
              Check your email for updates.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link to="/" className="block">
              <Button variant="outline" className="w-full h-12">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Home
              </Button>
            </Link>
            <p className="text-center text-xs text-muted-foreground">
              Need help?{" "}
              <a href="mailto:support@teamtune.io" className="text-primary hover:underline">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PendingApproval;
