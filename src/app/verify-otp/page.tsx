"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import OtpInput from "../components/otp-input";
import Alert from "../components/alert";
import Button from "../components/button";
import { useVerifyOtp } from "../hooks/useVerifyOtp";
import { useResendOtp } from "../hooks/useResendOtp";

export default function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const { verifyOtp, isLoading, error, success, clearMessages } =
    useVerifyOtp(email);

  const { countdown, canResend, resendOtp, isSending } = useResendOtp(email);
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
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a 6-digit code to{" "}
          <span className="font-semibold text-gray-900">{email}</span>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
          {/* Error Message */}
          {error && <Alert type="error" message={error} />}

          {/* Success Message */}
          {success && <Alert type="success" message={success} />}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 text-center mb-4">
                Enter verification code
              </label>
              <OtpInput
                length={6}
                onComplete={verifyOtp}
                disabled={isLoading || !!success}
                error={!!error}
              />
            </div>

            {/* Resend OTP */}
            <div className="text-center">
              {canResend ? (
                <Button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    resendOtp();
                  }}
                  disabled={isLoading}
                  className="text-sm font-semibold text-indigo-600 disabled:opacity-50"
                >
                  Resend OTP
                </Button>
              ) : (
                <p className="text-sm text-gray-500">
                  Resend OTP in{" "}
                  <span className="font-semibold text-gray-900">
                    {countdown}s
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
