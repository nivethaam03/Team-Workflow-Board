import * as React from "react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, LayoutGrid, Github, Chrome } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface LoginPageProps {
  onLogin: (email: string) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate frontend login delay
    setTimeout(() => {
      onLogin(email);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-background">
      {/* Left Side: Login Form */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-8 relative z-10 bg-background">
        <div className="max-w-sm w-full mx-auto space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20">
                <LayoutGrid className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Zencoder Team
              </h2>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-black text-foreground mb-2 tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Enter your details to access your workspace.
              </p>
            </motion.div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-0.5">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="email"
                  placeholder="name@company.com"
                  className="pl-10 h-11 bg-muted/20 border-border focus:border-primary focus:ring-2 focus:ring-primary/5 rounded-xl transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-end pl-0.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Password
                </label>
                <button type="button" className="text-[10px] font-bold text-primary hover:underline">
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 bg-muted/20 border-border focus:border-primary focus:ring-2 focus:ring-primary/5 rounded-xl transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 pl-0.5">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-3.5 h-3.5 rounded border-border bg-muted/20 text-primary focus:ring-primary/10" 
              />
              <label htmlFor="remember" className="text-xs font-medium text-muted-foreground select-none">
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl font-bold text-base shadow-lg shadow-primary/10 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span className="text-sm">Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </div>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black">
              <span className="bg-background px-3 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-11 rounded-xl border-border bg-muted/10 hover:bg-muted/20 font-bold text-xs transition-all">
              <Chrome className="h-4 w-4 mr-2" />
              Google
            </Button>
            <Button variant="outline" className="h-11 rounded-xl border-border bg-muted/10 hover:bg-muted/20 font-bold text-xs transition-all">
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
          </div>
          
          <p className="text-center text-xs text-muted-foreground">
            No account?{" "}
            <button className="text-primary font-bold hover:underline">Start for free</button>
          </p>
        </div>
      </div>

      {/* Right Side: Visual Content */}
      <div className="hidden lg:block relative w-[60%]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-background/10 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Decorative Blur Circles */}
        <div className="absolute top-1/4 right-1/4 h-64 w-64 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 h-32 w-32 bg-sky-500/10 rounded-full blur-[60px]" />
      </div>
    </div>
  );
};