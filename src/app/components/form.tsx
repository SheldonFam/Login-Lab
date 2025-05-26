"use client";

import { useForm, FieldValues, RegisterOptions } from "react-hook-form";
import { FormInput } from "./form-input";

interface FormField {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  showPasswordToggle?: boolean;
  autoComplete?: string;
  disabled?: boolean;
  helperText?: string;
}

interface FormProps {
  fields: FormField[];
  onSubmit: (values: FieldValues) => void;
  submitLabel: string;
  isLoading?: boolean;
  defaultValues?: FieldValues;
  className?: string;
}

export function Form({
  fields,
  onSubmit,
  submitLabel,
  isLoading = false,
  defaultValues = {},
  className = "",
}: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const getValidationRules = (field: FormField): RegisterOptions => {
    const rules: RegisterOptions = {};

    if (field.type === "email") {
      rules.pattern = {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      };
    }

    if (field.type === "password") {
      rules.minLength = {
        value: 8,
        message: "Password must be at least 8 characters",
      };
      rules.pattern = {
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      };
    }

    return rules;
  };

  const handleFormSubmit = async (values: FieldValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`space-y-6 ${className}`}
      noValidate
    >
      {fields.map((field) => (
        <FormInput
          key={field.id}
          {...field}
          register={register}
          errors={errors}
          validation={getValidationRules(field)}
        />
      ))}

      <div>
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading || isSubmitting ? (
            <div className="flex items-center">
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
              Processing...
            </div>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
