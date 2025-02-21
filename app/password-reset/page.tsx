"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Send, AlertCircle, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import { ToastMessage } from "@/components/toast/ToastMessage";
import PasswordService from "@/components/password/service/PasswordService";
import PasswordResetDTO from "@/components/password/dto/PasswordResetDTO";

export default function PasswordResetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const passwordService = new PasswordService();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }
      try {
        const isValid = await passwordService.isValidateToken(token);
        setTokenValid(isValid);
      } catch (error) {
        setTokenValid(false);
      }
    };
    verifyToken();
  }, [token, passwordService]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Passwords do not match"
          message="Please enter the same password in both fields."
          onClose={() => toast.dismiss(t)}
        />
      ));
      return;
    }

    setIsLoading(true);

    try {
      const passwordResetDTO: PasswordResetDTO = {
        token: token!,
        newPassword,
      };

      const message = await passwordService.passwordReset(passwordResetDTO);

      toast.custom((t) => (
        <ToastMessage
          type="success"
          title="Password Reset Successful"
          message={message || "You can now log in with your new password."}
          onClose={() => toast.dismiss(t)}
        />
      ));
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      toast.custom((t) => (
        <ToastMessage
          type="error"
          title="Reset Failed"
          message={error.message || "Something went wrong. Try again!"}
          onClose={() => toast.dismiss(t)}
        />
      ));
    } finally {
      setIsLoading(false);
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
              <Send className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white ml-4">GDFUTURE</h1>
        </div>

        {tokenValid === null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/[0.02] border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center backdrop-blur-xl"
          >
            <Loader2 className="w-8 h-8 text-yellow-500 animate-spin mb-4" />
            <p className="text-white/60">Verifying reset link...</p>
          </motion.div>
        ) : !tokenValid ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden bg-gradient-to-br from-red-500/5 to-red-600/5 rounded-2xl border border-red-500/10 p-8"
          >
            <div className="absolute inset-0 bg-red-500/20 blur-3xl" />
            <div className="relative z-10">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-red-500 rounded-full blur opacity-20" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-full flex items-center justify-center border border-red-500/20">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-red-500 mb-3">
                  Invalid Reset Link
                </h2>
                <p className="text-white/70 text-center mb-6 max-w-sm">
                  The password reset link has expired or is invalid. Please request a new link.
                </p>
                {/* Action Buttons */}
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <button
                    onClick={() => router.push("/forgot-password")}
                    className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-400 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 transition-all"
                  >
                    Request New Link
                  </button>
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full px-6 py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/[0.02] border border-white/10 rounded-xl p-6 backdrop-blur-xl"
          >
            <h2 className="text-xl font-semibold text-white mb-2">
              Reset your password
            </h2>
            <p className="text-white/60 text-sm mb-6">
              Enter your new password below.
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 rounded-lg font-medium hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 transition-all disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </motion.div>
        )}
      </motion.div>
      <Toaster position="top-center" />
    </div>
  );
}
