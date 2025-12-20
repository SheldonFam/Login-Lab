"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Form from "../components/form";
import Alert from "../components/alert";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schema";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { register, handleSubmit, formState } = useForm<RegisterFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormData) => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

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
        setTimeout(() => {
          router.push("/login?registered=true");
        }, 3000);
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
                fields={[
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
                ]}
                register={register}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                errors={formState.errors}
                isSubmitted={formState.isSubmitted}
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
