"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Form from "../components/form";
import Alert from "../components/alert";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../schemas/auth.schema";
import { useResetPassword } from "../lib/hooks/use-reset-password";

export default function ResetPasswordPage() {
  const { reset, isLoading, error, success } = useResetPassword();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { register, handleSubmit, formState } = useForm<ResetPasswordFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (values: ResetPasswordFormData) => {
    if (!token) {
      return;
    }

    await reset({
      token,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  if (!token) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Alert type="error" message="Invalid or missing reset token" />
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
          {!token ? (
            <>
              <Alert type="error" message="Invalid or missing reset token" />
              <div className="mt-4 text-center">
                <Link
                  href="/forgot-password"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Request a new password reset
                </Link>
              </div>
            </>
          ) : success ? (
            <Alert
              type="success"
              message="Password has been reset successfully!"
            />
          ) : (
            <>
              {error && <Alert type="error" message={error} />}

              <Form
                fields={[
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
                ]}
                register={register}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                errors={formState.errors}
                isSubmitted={formState.isSubmitted}
                submitLabel="Reset password"
                isLoading={isLoading}
              />
            </>
          )}
          <div className="mt-6 text-sm/6 text-center">
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
