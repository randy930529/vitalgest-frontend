import { JSX, useState } from "react";
import clsx from "clsx";
import { ChecklistQuestionsType, FormInputType } from "@/app/lib/definitions";
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

export function FormSelect({
  name,
  title,
  options,
  defaultValue,
  errors,
  required,
  disabled,
  inline,
  contents,
  handleOption,
}: {
  name: string;
  title?: string;
  options: {
    id: string | number;
    value: string;
    label: string;
  }[];
  defaultValue?: string | number;
  errors?: string[];
  required?: boolean;
  disabled?: boolean;
  inline?: boolean;
  contents?: boolean;
  handleOption?: (name: string, value: string) => void;
}) {
  return (
    <div
      className={clsx({ "flex gap-2 md:gap-4": inline, contents: contents })}
    >
      {title && (
        <label
          htmlFor={name}
          className={clsx(
            "mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white",
            { block: !inline }
          )}
        >
          {title}
          {required && <span className="text-red-600"> *</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className={clsx(
          "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500",
          { "block w-full p-2.5": !inline }
        )}
        required={required}
        disabled={disabled}
        onChange={(e) =>
          handleOption && handleOption(e.target.name, e.target.value)
        }
      >
        {options.map(({ id, value, label }) => (
          <option key={id} value={value}>
            {label}
          </option>
        ))}
      </select>
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

export function FormCheckbox({
  name,
  title,
  isChecked,
}: {
  name: string;
  title: string;
  isChecked: boolean;
}) {
  const [checked, setChecked] = useState(isChecked);

  return (
    <label
      htmlFor={name}
      className="inline-flex items-center me-5 cursor-pointer"
    >
      <input
        id={name}
        type="checkbox"
        name={name}
        className="sr-only peer"
        defaultChecked={checked}
        onChange={() => setChecked(!checked)}
      />
      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
        {title}
      </span>
    </label>
  );
}

export function FormTextarea({
  name,
  title,
  rows = 4,
  placeholder,
}: {
  name: string;
  title?: string;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <>
      {title && (
        <label
          form={name}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {title}
        </label>
      )}
      <textarea
        id={name}
        rows={rows}
        className="block  my-2 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder}
      ></textarea>
    </>
  );
}

export function FormSignature(param: {
  name: string;
  title: string;
  usersOptions: {
    id: string | number;
    value: string;
    label: string;
    position?: string;
  }[];
  errors?: string[];
  required?: boolean;
}) {
  const [position, setPosition] = useState("");
  const { usersOptions, ...rest } = param;

  function handlePosition(userId: string) {
    setPosition(
      usersOptions.find(({ value }) => value === userId)?.position || ""
    );
  }

  return (
    <>
      <FormSelect
        {...rest}
        options={usersOptions}
        handleOption={(_, value) => handlePosition(value)}
        inline
      />
      <FormTextarea name={param.name} />
      <p>
        Cargo: <span className="inline-block">{position}</span>
      </p>
    </>
  );
}

export function FormInputSingle({
  name,
  type,
  title,
  errors,
  initialValue,
  required,
  placeholder,
}: {
  name: string;
  type: string;
  title?: string;
  initialValue?: string;
  errors?: string[];
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <>
      {title && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-900 dark:text-white"
        >
          {title}
          {required && <span className="text-red-600"> *</span>}
        </label>
      )}

      <input
        type={type}
        name={name}
        id={name}
        defaultValue={initialValue || ""}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-0.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
    </>
  );
}

export function FormInputSetter({
  type,
  name,
  title,
}: {
  type: ChecklistQuestionsType["type_response"];
  name: string;
  title?: string;
}): JSX.Element {
  const customOptios = [
    {
      id: 1,
      value: "bueno",
      label: `Bueno\u00A0\u00A0\u00A0`,
    },
    {
      id: 2,
      value: "regular",
      label: "Regular\u00A0\u00A0\u00A0",
    },
    {
      id: 3,
      value: "malo",
      label: "Malo\u00A0\u00A0\u00A0",
    },
  ];

  switch (type) {
    case "text":
      return (
        <FormInputSingle
          key={`question-input-${name}`}
          type={type}
          name={name}
          title={title}
        />
      );

    case "bool":
      return (
        <FormCheckbox
          key={`question-checkbox-${name}`}
          name={name}
          title={title || ""}
          isChecked
        />
      );

    case "bool_text":
      return (
        <>
          <FormCheckbox
            key={`question-checkbox-${name}`}
            name={name}
            title={title || ""}
            isChecked
          />
          <FormInputSingle
            key={`question-input-${name}`}
            type={type}
            name={name}
            placeholder={title}
          />
        </>
      );

    case "bool_option":
      return (
        <>
          <FormCheckbox
            key={`question-checkbox-${name}`}
            name={name}
            title={title || ""}
            isChecked
          />
          <FormSelect
            key={`question-select-${name}`}
            name={name}
            options={customOptios}
            inline
          />
        </>
      );

    case "option":
      return (
        <FormSelect
          key={`question-select-${name}`}
          name={name}
          title={title}
          options={customOptios}
          inline
          contents
        />
      );

    case "option_text":
      return (
        <>
          <FormSelect
            key={`question-select-${name}`}
            name={name}
            title={title}
            options={customOptios}
            inline
          />
          <FormInputSingle
            key={`question-input-${name}`}
            type={type}
            name={name}
            placeholder={title}
          />
        </>
      );

    case "bool_option_text":
      return (
        <>
          <FormCheckbox
            key={`question-checkbox-${name}`}
            name={name}
            title={title || ""}
            isChecked
          />
          <FormSelect
            key={`question-select-${name}`}
            name={name}
            options={customOptios}
            inline
          />
          <FormInputSingle
            key={`question-input-${name}`}
            type={type}
            name={name}
            placeholder={title}
          />
        </>
      );

    default:
      return <></>;
  }
}
