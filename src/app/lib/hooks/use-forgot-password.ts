"use client";

import { useState } from "react";
import { requestPasswordReset } from "../services/forgot-password.service";

/**
 * Custom hook for handling forgot password flow
 */
export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const requestReset = async (email: string) => {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const result = await requestPasswordReset(email);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Failed to send reset email");
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

  return { requestReset, isLoading, error, success };
}

