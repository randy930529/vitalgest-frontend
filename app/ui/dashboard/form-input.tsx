import { FormInputType } from "@/app/lib/definitions";
import { InlineErrors } from "@/app/ui/custom-errors";

export function FormInput({
  name,
  errors,
  initialValue,
  customFormInput,
}: {
  name: string;
  initialValue?: string;
  errors?: string[];
  customFormInput: FormInputType;
}) {
  const { type, title, required, placeholder } = customFormInput[name];

  return (
    <div>
      <label
        htmlFor={name}
        className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {title}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        defaultValue={initialValue || ""}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        placeholder={placeholder || title}
        required={required}
      />
      {errors && (
        <InlineErrors
          key={`${name}-error`}
          errorId={`${name}-error`}
          errors={errors}
        />
      )}
    </div>
  );
}
