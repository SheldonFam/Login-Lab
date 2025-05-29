"use client";

import { useState } from "react";
import {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import clsx from "clsx";

interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  register?: UseFormRegister<FieldValues>;
  errors?: FieldErrors;
  showPasswordToggle?: boolean;
  validation?: RegisterOptions;
  autoComplete?: string;
  disabled?: boolean;
  helperText?: string;
  showAsterisk?: boolean;
}

export function FormInput({
  id,
  name,
  type,
  label,
  placeholder,
  required = false,
  register,
  errors,
  showPasswordToggle = false,
  validation,
  autoComplete,
  disabled = false,
  helperText,
  showAsterisk = false,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPasswordField = type === "password";
  const inputType =
    showPasswordToggle && isPasswordField && showPassword ? "text" : type;

  // Safely get the error message string
  const errorMessage = errors?.[name]?.message as string | undefined;

  const registerProps = register
    ? register(name, {
        ...validation,
        required: required ? "This field is required" : false,
      })
    : {};

  if (type === "checkbox") {
    return (
      <div className="flex items-center">
        <input
          id={id}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          {...registerProps}
          disabled={disabled}
        />
        <label htmlFor={id} className="ml-2 block text-sm text-gray-900">
          {label}
        </label>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm/6 font-medium text-gray-900">
        {label}
        {showAsterisk && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          {...registerProps}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={errorMessage ? "true" : "false"}
          aria-describedby={
            errorMessage
              ? `${id}-error`
              : helperText
              ? `${id}-description`
              : undefined
          }
          className={clsx(
            "block w-full rounded-md px-3 py-1.5 text-base sm:text-sm/6",
            "placeholder:text-gray-400 text-gray-900",
            "outline-none ring-1 ring-inset",
            {
              "ring-red-500 focus:ring-red-500": errorMessage,
              "ring-gray-300 focus:ring-indigo-500": !errorMessage,
              "bg-gray-50 cursor-not-allowed": disabled,
              "bg-white": !disabled,
              "ring-indigo-300": !errorMessage && isFocused && !disabled,
            }
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        )}
      </div>
      {errorMessage && (
        <p
          className="mt-2 text-sm text-red-600"
          id={`${id}-error`}
          role="alert"
        >
          {errorMessage}
        </p>
      )}
      {helperText && !errorMessage && (
        <p className="mt-2 text-sm text-gray-500" id={`${id}-description`}>
          {helperText}
        </p>
      )}
    </div>
  );
}
