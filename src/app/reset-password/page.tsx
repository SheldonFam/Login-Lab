"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Form } from "../components/form";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
    }
  }, [token]);

  const handleSubmit = async (values: { [key: string]: string }) => {
    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to reset password");
      }
    } catch (err: unknown) {
      console.error("Reset password error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      id: "password",
      name: "password",
      type: "password",
      label: "New password",
      placeholder: "Enter your new password",
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

  if (!token) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="rounded-md bg-red-50 p-4">
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
                  Invalid or missing reset token
                </h3>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/forgot-password"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Request a new password reset
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm/6 text-gray-600">
          Enter your new password below.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
          {success ? (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Password has been reset successfully!
                  </p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Link
                  href="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Return to login
                </Link>
              </div>
            </div>
          ) : (
            <>
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

              <Form
                fields={fields}
                onSubmit={handleSubmit}
                submitLabel="Reset password"
                isLoading={isLoading}
              />

              <div className="mt-6 text-sm/6 text-center">
                <Link
                  href="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
