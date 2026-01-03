"use client";

import { useState } from "react";
import {
  resetPassword,
  type ResetPasswordData,
} from "../services/reset-password.service";

/**
 * Custom hook for handling password reset
 */
export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const reset = async (data: ResetPasswordData) => {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const result = await resetPassword(data);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Failed to reset password");
      }

      return result;
    } catch (err) {
      const errorMessage = "An error occurred. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { reset, isLoading, error, success };
}
