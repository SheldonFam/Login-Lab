"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Form } from "../components/form";

export default function RegisterPage() {
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
          window.location.href = "/login?registered=true";
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
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l3 3a.75.75 0 001.137-.089l4.003-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {successMessage}
                    </p>
                  </div>
                </div>
              </div>
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
