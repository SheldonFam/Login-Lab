"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, type LoginCredentials } from "../services/login.service";

/**
 * Custom hook for handling user login
 */
export function useLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginUser(credentials);

      if (result.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.error || "Login failed");
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

  return { login, isLoading, error };
}
