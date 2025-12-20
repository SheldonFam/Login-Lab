"use client";

import {
  UseFormRegister,
  UseFormHandleSubmit,
  Path,
  FieldValues,
  FieldErrors,
} from "react-hook-form";
import FormInput from "./form-input";
import Button from "./button";

interface FormField<TFormData extends FieldValues> {
  id: string;
  name: Path<TFormData>;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  showPasswordToggle?: boolean;
  autoComplete?: string;
  showAsterisk?: boolean;
  helperText?: string;
}

interface FormProps<TFormData extends FieldValues> {
  fields: FormField<TFormData>[];
  register: UseFormRegister<TFormData>;
  handleSubmit: UseFormHandleSubmit<TFormData>;
  onSubmit: (values: TFormData) => void;
  errors: FieldErrors<TFormData>;
  isSubmitted: boolean;
  submitLabel: string;
  isLoading?: boolean;
}

export default function Form<TFormData extends FieldValues>({
  fields,
  register,
  handleSubmit,
  onSubmit,
  errors,
  isSubmitted,
  submitLabel,
  isLoading,
}: FormProps<TFormData>) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {fields.map((field) => (
        <FormInput
          key={field.id}
          {...field}
          registerProps={register(field.name)}
          errors={errors}
          showError={isSubmitted}
        />
      ))}

      <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
        {submitLabel}
      </Button>
    </form>
  );
}
