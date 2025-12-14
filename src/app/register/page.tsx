"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Form from "../components/form";
import Alert from "../components/alert";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (values: { [key: string]: string }) => {
    setIsLoading(true);
    setError("");
    setSuccessMessage(""); // Clear previous messages

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push("/login?registered=true");
        }, 3000); // 3000 milliseconds = 3 seconds
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed");
      }
    } catch (err: unknown) {
      console.error("Registration error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      id: "name",
      name: "name",
      type: "text",
      label: "Full name",
      placeholder: "Enter your full name",
      required: true,
      autoComplete: "name",
      showAsterisk: true,
    },
    {
      id: "email",
      name: "email",
      type: "email",
      label: "Email address",
      placeholder: "Enter your email",
      required: true,
      autoComplete: "email",
      showAsterisk: true,
    },
    {
      id: "password",
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "Create a password",
      required: true,
      showPasswordToggle: true,
      autoComplete: "new-password",
      showAsterisk: true,
      helperText:
        "Must be at least 8 characters with uppercase, lowercase, number and special character",
    },
    {
      id: "confirmPassword",
      name: "confirmPassword",
      type: "password",
      label: "Confirm new password",
      placeholder: "Confirm your new password",
      required: true,
      showPasswordToggle: true,
      autoComplete: "new-password",
      showAsterisk: true,
    },
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
          className="mx-auto"
          width={40}
          height={40}
        />
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Create your account
        </h2>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
            {/* Error Message */}
            {error && <Alert type="error" message={error} />}

            {/* Success Message */}
            {successMessage && (
              <Alert type="success" message={successMessage} />
            )}

            {/* Form (hidden when success message is shown) */}
            {!successMessage && (
              <Form
                fields={fields}
                onSubmit={handleSubmit}
                submitLabel="Create account"
                isLoading={isLoading}
              />
            )}
          </div>
        </div>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
