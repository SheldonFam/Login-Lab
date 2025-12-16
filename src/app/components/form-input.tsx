//
"use client";

import { useState, forwardRef, InputHTMLAttributes } from "react";
import { UseFormRegisterReturn, FieldErrors } from "react-hook-form";
import clsx from "clsx";
import CheckboxInput from "./checkbox";
import PasswordToggle from "./passwordToggle";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  label: string;
  registerProps?: UseFormRegisterReturn;
  errors?: FieldErrors;
  showPasswordToggle?: boolean;
  helperText?: string;
  showAsterisk?: boolean;
  showError?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      name,
      type = "text",
      label,
      placeholder,
      disabled = false,
      registerProps,
      errors,
      showPasswordToggle = false,
      helperText,
      showAsterisk = false,
      showError = false,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const errorMessage = errors?.[name]?.message as string | undefined;
    const shouldShowError = showError && !!errorMessage;

    const inputType =
      showPasswordToggle && type === "password" && showPassword ? "text" : type;

    const ariaDescribedBy = shouldShowError
      ? `${id}-error`
      : helperText
      ? `${id}-description`
      : undefined;

    const inputClasses = clsx(
      "block w-full rounded-md px-3 py-1.5 text-base sm:text-sm/6 placeholder:text-gray-400 text-gray-900 outline-none ring-1 ring-inset",
      disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white",
      shouldShowError
        ? "ring-red-500 focus:ring-red-500"
        : isFocused
        ? "ring-indigo-300 focus:ring-indigo-500"
        : "ring-gray-300"
    );

    // Early return for checkbox
    if (type === "checkbox") {
      return (
        <CheckboxInput
          id={id}
          label={label}
          disabled={disabled}
          registerProps={registerProps}
        />
      );
    }

    return (
      <div>
        <label
          htmlFor={id}
          className="block text-sm/6 font-medium text-gray-900"
        >
          {label}
          {showAsterisk && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative mt-2">
          <input
            id={id}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={shouldShowError}
            aria-describedby={ariaDescribedBy}
            className={inputClasses}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            ref={ref}
            {...registerProps}
            {...rest}
          />

          {showPasswordToggle && type === "password" && (
            <PasswordToggle
              show={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
        </div>

        {shouldShowError ? (
          <p
            className="mt-2 text-sm text-red-600"
            id={`${id}-error`}
            role="alert"
          >
            {errorMessage}
          </p>
        ) : helperText ? (
          <p className="mt-2 text-sm text-gray-500" id={`${id}-description`}>
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
export default FormInput;
