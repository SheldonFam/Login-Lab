"use client";

import {
  UseFormRegister,
  UseFormHandleSubmit,
  Path,
  FieldValues,
  UseFormStateReturn,
  get,
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
  formState: UseFormStateReturn<TFormData>;
  submitLabel: string;
  isLoading?: boolean;
}

export default function Form<TFormData extends FieldValues>({
  fields,
  register,
  handleSubmit,
  onSubmit,
  formState,
  submitLabel,
  isLoading,
}: FormProps<TFormData>) {
  const { errors, touchedFields, dirtyFields, isSubmitted } = formState;
  const onFormSubmit = (values: TFormData) => {
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
          registerProps={register(field.name)}
          errors={errors}
          showError={
            isSubmitted ||
            !!get(touchedFields, field.name) ||
            !!get(dirtyFields, field.name)
          }
        />
      ))}

      <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
        {submitLabel}
      </Button>
    </form>
  );
}
