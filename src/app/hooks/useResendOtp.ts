import { useEffect, useState } from "react";

export const useResendOtp = (email: string | null, duration = 60) => {
  const [countdown, setCountdown] = useState(duration);
  const [isSending, setIsSending] = useState(false);

  const canResend = countdown === 0;

  useEffect(() => {
    if (!canResend) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, canResend]);

  const resendOtp = async () => {
    if (!email || isSending) return;

    setIsSending(true);

    try {
      const res = await fetch("api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to resend OTP");
      }
      setCountdown(duration);
    } catch (err) {
      console.error("Resend OTP error:", err);
    } finally {
      setIsSending(false);
    }
  };

  return {
    canResend,
    countdown,
    isSending,
    resendOtp,
  };
};
