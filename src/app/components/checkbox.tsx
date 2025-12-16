export default function CheckboxInput({
  id,
  label,
  disabled,
  registerProps,
}: {
  id: string;
  label: string;
  disabled?: boolean;
  registerProps?: any;
}) {
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
