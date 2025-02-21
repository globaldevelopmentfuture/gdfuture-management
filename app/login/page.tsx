"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Mail, Lock, ArrowLeft, Send, EyeOff, Eye, AlertCircle, Loader2 } from "lucide-react";
import UserService from "@/components/user/service/UserService";
import { toast, Toaster } from "sonner";
import { ToastMessage } from "@/components/toast/ToastMessage";
import { LoginContext } from "@/components/context/LoginProvider";
import LoginContextType from "@/components/context/LoginContextType";
import PasswordService from "@/components/password/service/PasswordService";

export default function LoginPage() {
  const { setUserCookie } = useContext(LoginContext) as LoginContextType;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetState, setResetState] = useState<"input" | "loading" | "success" | "error">("input");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const passwordService = new PasswordService();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userService = new UserService();
      const loginResponse = await userService.login({ email, password });
      setUserCookie(loginResponse);
      toast.custom((t) => (
        <ToastMessage
          type="success"
          title="Success"
          message="Welcome back! Login successful."
          onClose={() => toast.dismiss(t)}
        />
      ));
      router.push("/");
    } catch (error: any) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Authentication Failed"
          message={error.message || "Failed to login"}
          onClose={() => toast.dismiss(t)}
        />
      ));
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetState("loading");

    try {
      await passwordService.passwordResetRequest(email);
      setResetState("success");
    } catch (error) {
      setErrorMessage((error as Error).message || "Failed to send reset instructions");
      setResetState("error");
    }
  };

  const renderResetContent = () => {
    switch (resetState) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
            <p className="text-white/70">Sending reset instructions...</p>
          </div>
        );

      case "success":
        return (
          <div className="text-center py-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500 rounded-full blur opacity-20" />
              <div className="relative w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                <Send className="w-8 h-8 text-emerald-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Check your email
            </h3>
            <p className="text-white/70 text-center max-w-sm mx-auto">
              We've sent password reset instructions to your email address.
              Please check your inbox and follow the instructions.
            </p>
          </div>
        );

      case "error":
        return (
          <div className="text-center py-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-red-500 rounded-full blur opacity-20" />
              <div className="relative w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-red-500 mb-3">
              Reset Failed
            </h3>
            <p className="text-white/70 text-center mb-6 max-w-sm mx-auto">
              {errorMessage}
            </p>
            <button
              onClick={() => setResetState("input")}
              className="px-6 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all"
            >
              Try Again
            </button>
          </div>
        );

      default:
        return (
          <>
            <h2 className="text-xl font-semibold text-white mb-2">
              Reset password
            </h2>
            <p className="text-white/60 text-sm mb-6">
              Enter your email address and we'll send you
              instructions to reset your password.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-lg font-medium hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 transition-all"
              >
                Send reset instructions
              </button>
            </form>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500 rounded-xl blur-xl opacity-20" />
            <div className="relative w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center border border-yellow-500/20">
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white ml-4">GDFUTURE</h1>
        </div>

        <AnimatePresence mode="wait">
          {!isResetMode ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/[0.02] border border-white/10 rounded-xl p-6 backdrop-blur-xl"
            >
              <h2 className="text-xl font-semibold text-white mb-2">
                Welcome back
              </h2>
              <p className="text-white/60 text-sm mb-6">
                Sign in to access your dashboard
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-lg font-medium hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 transition-all"
                >
                  Sign in
                </button>

                <button
                  type="button"
                  onClick={() => setIsResetMode(true)}
                  className="w-full text-sm text-white/60 hover:text-white transition-colors"
                >
                  Forgot your password?
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="reset"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/[0.02] border border-white/10 rounded-xl p-6 backdrop-blur-xl"
            >
              <button
                onClick={() => {
                  setIsResetMode(false);
                  setResetState("input");
                }}
                className="flex items-center text-white/60 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </button>

              {renderResetContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <Toaster position="top-center" />
    </div>
  );
}