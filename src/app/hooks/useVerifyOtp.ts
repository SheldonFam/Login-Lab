import { useRouter } from "next/navigation";
import { useState } from "react";

export const useVerifyOtp = (email: string | null) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const verifyOtp = async (otp: string) => {
    if (!email || isLoading) return;

    setIsLoading(true);
    setError("");

    // 🔧 MOCK (local testing only)
    await new Promise((res) => setTimeout(res, 1000));

    if (otp === "123456") {
      setSuccess("Email verified successfully! Redirecting...");
      setTimeout(() => router.push("/login?verified=true"), 2000);
    } else {
      setError("Invalid OTP");
    }

    setIsLoading(false);
  };

  return {
    verifyOtp,
    isLoading,
    error,
    success,
    clearMessages: () => {
      setError("");
      setSuccess("");
    },
  };
};
