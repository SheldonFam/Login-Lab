import { signIn } from "next-auth/react";

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

/**
 * Service function to handle user login
 */
export async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResult> {
  try {
    const result = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      remember: credentials.remember === true,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "An error occurred. Please try again.",
    };
  }
}

