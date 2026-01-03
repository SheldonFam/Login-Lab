"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import Form from "../components/form";
import Alert from "../components/alert";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../schemas/auth.schema";
import { useForgotPassword } from "../lib/hooks/use-forgot-password";

export default function ForgotPasswordPage() {
  const { requestReset, isLoading, error, success } = useForgotPassword();

  const { register, handleSubmit, formState } = useForm<ForgotPasswordFormData>(
    {
      mode: "onChange",
      reValidateMode: "onChange",
      resolver: zodResolver(forgotPasswordSchema),
    }
  );

  const onSubmit = async (values: ForgotPasswordFormData) => {
    await requestReset(values.email);
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
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm/6 text-gray-600">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
          {success ? (
            <Alert
              type="success"
              message="Password reset email sent! Please check your inbox."
            />
          ) : (
            <>
              {error && <Alert type="error" message={error} />}

              <Form
                fields={[
                  {
                    id: "email",
                    name: "email",
                    type: "email",
                    label: "Email address",
                    placeholder: "Email address",
                    required: true,
                    autoComplete: "email",
                    showAsterisk: true,
                  },
                ]}
                register={register}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                errors={formState.errors}
                isSubmitted={formState.isSubmitted}
                submitLabel="Send reset link"
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
