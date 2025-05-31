"use client";

import { useForm } from "react-hook-form";
import { FormInput } from "./form-input";

interface FormValues {
  [key: string]: string;
}

interface FormProps {
  fields: {
    id: string;
    name: string;
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    showPasswordToggle?: boolean;
    autoComplete?: string;

    helperText?: string;
  }[];
  onSubmit: (values: FormValues) => void;
  submitLabel: string;
  isLoading?: boolean;
}

export function Form({ fields, onSubmit, submitLabel, isLoading }: FormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields, isSubmitted, dirtyFields },
  } = useForm<FormValues>({
    mode: "onChange", // Validate on change
    reValidateMode: "onChange", // Re-validate on change
  });

  const getValidationRules = (field: FormProps["fields"][0]) => {
    const rules: Record<string, unknown> = {};

    if (field.required) {
      rules.required = "This field is required";
    }

    if (field.type === "email") {
      rules.maxLength = {
        value: 254, // RFC 5321
        message: "Email must be less than 254 characters",
      };
      rules.pattern = {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Please enter a valid email address",
      };
      rules.validate = {
        validDomain: (value: string) => {
          const domain = value.split("@")[1];
          const commonDomains = [
            "gmail.com",
            "yahoo.com",
            "hotmail.com",
            "outlook.com",
          ];
          if (!commonDomains.includes(domain?.toLowerCase())) {
            return "Please use a common email domain";
          }
          return true;
        },
      };
    }

    if (field.type === "password") {
      rules.minLength = {
        value: 8,
        message: "Password must be at least 8 characters",
      };
      rules.maxLength = {
        value: 128,
        message: "Password must be less than 128 characters",
      };
      rules.pattern = {
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      };
    }

    // Add password confirmation validation
    if (field.name === "confirmPassword") {
      rules.validate = {
        matchesPassword: (value: string) => {
          const password = watch("password");
          return value === password || "Passwords do not match";
        },
      };
    }

    return rules;
  };

  const onFormSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-6"
      noValidate
    >
      {fields.map((field) => (
        <FormInput
          key={field.id}
          {...field}
          register={register}
          errors={errors}
          validation={getValidationRules(field)}
          showError={
            isSubmitted || touchedFields[field.name] || dirtyFields[field.name]
          } // Show error if field is touched, dirty, or form is submitted
        />
      ))}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : null}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
