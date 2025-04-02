
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { LogIn } from "lucide-react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onOpenChange }) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoading(true);
      
      // Simulate API call with a short delay
      setTimeout(() => {
        login(username.trim());
        setUsername("");
        setIsLoading(false);
        onOpenChange(false);
      }, 800);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newState) => {
      if (!isLoading) {
        onOpenChange(newState);
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to QuietSpotter</DialogTitle>
          <DialogDescription>
            Sign in to submit noise reports and help others find quiet work spaces.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              disabled={isLoading}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              This is just a demo app, so no password is required.
            </p>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!username.trim() || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">◌</span>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </span>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
