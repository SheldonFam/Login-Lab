export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResult {
  success: boolean;
  error?: string;
}

/**
 * Service function to reset password with token
 */
export async function resetPassword(
  data: ResetPasswordData
): Promise<ResetPasswordResult> {
  try {
    const response = await fetch("/api/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: data.token,
        password: data.password,
      }),
    });

    if (response.ok) {
      return { success: true };
    }

    const errorData = await response.json();
    return {
      success: false,
      error: errorData.message || "Failed to reset password",
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      error: "An error occurred. Please try again.",
    };
  }
}
