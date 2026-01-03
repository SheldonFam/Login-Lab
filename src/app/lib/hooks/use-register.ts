"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, type RegisterData } from "../services/register.service";

/**
 * Custom hook for handling user registration
 */
export function useRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await registerUser(data);

      if (result.success) {
        setSuccessMessage(
          result.message || "Registration successful! Redirecting to login..."
        );
        setTimeout(() => {
          router.push("/login?registered=true");
        }, 3000);
      } else {
        setError(result.error || "Registration failed");
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

  return { register, isLoading, error, successMessage };
}
