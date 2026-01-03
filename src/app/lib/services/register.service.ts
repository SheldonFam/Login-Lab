export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResult {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Service function to handle user registration
 */
export async function registerUser(
  data: RegisterData
): Promise<RegisterResult> {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        message: result.message || "Registration successful!",
      };
    }

    const errorData = await response.json();
    return {
      success: false,
      error: errorData.message || "Registration failed",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "An error occurred. Please try again.",
    };
  }
}

