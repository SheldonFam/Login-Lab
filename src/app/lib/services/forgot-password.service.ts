export interface ForgotPasswordResult {
  success: boolean;
  error?: string;
}

/**
 * Service function to request password reset
 */
export async function requestPasswordReset(
  email: string
): Promise<ForgotPasswordResult> {
  try {
    const response = await fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      return { success: true };
    }

    const data = await response.json();
    return {
      success: false,
      error: data.message || "Failed to send reset email",
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      error: "An error occurred. Please try again.",
    };
  }
}

