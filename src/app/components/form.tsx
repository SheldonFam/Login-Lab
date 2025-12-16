"use client";

import { useForm } from "react-hook-form";
import FormInput from "./form-input";
import Button from "./button";
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
    showAsterisk?: boolean;
    helperText?: string;
  }[];
  onSubmit: (values: FormValues) => void;
  submitLabel: string;
  isLoading?: boolean;
}

export default function Form({
  fields,
  onSubmit,
  submitLabel,
  isLoading,
}: FormProps) {
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
          registerProps={register(field.name, getValidationRules(field))}
          errors={errors}
          showError={
            isSubmitted || touchedFields[field.name] || dirtyFields[field.name]
          } // Show error if field is touched, dirty, or form is submitted
        />
      ))}

      <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
        {submitLabel}
      </Button>
    </form>
  );
}
