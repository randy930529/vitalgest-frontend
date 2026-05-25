import { ChangeEvent, JSX, useState } from "react";
import clsx from "clsx";
import { ArrowRightIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import {
  ChecklistQuestionsType,
  CustomOptions,
  FormInputType,
} from "@/app/lib/definitions";
import { STYLES } from "@/app/lib/config/constants";
import { InlineErrors } from "@/app/ui/custom-errors";
import Signit from "@/app/ui/components/signit";
import { Button } from "@/app/ui/button";

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
        className={clsx(
          "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500",
          STYLES.inputFocus,
        )}
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
            "mb-1.5 mt-3 text-sm font-medium text-gray-900 dark:text-white sm:mb-2 sm:mt-4",
            { block: !inline },
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
          { "block w-full p-2.5": !inline },
          STYLES.inputFocus,
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
        name={name}
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
  usersOptions: (CustomOptions & {
    position?: string;
    email?: string;
  })[];
  errors?: string[];
  required?: boolean;
  onSignedChange?: (signed: boolean) => void;
}) {
  const [position, setPosition] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const { usersOptions, onSignedChange, ...rest } = param;

  function handleSelectUser(userId: string) {
    const user = usersOptions.find(({ value }) => value === userId);
    setPosition(user?.position || "");
    setSelectedUserEmail(user?.email || "");
  }

  return (
    <div className="space-y-3">
      <label
        htmlFor={rest.name}
        className="block text-sm font-semibold text-slate-800"
      >
        {rest.title}
        {rest.required !== false && <span className="text-rose-600"> *</span>}
      </label>
      <select
        id={rest.name}
        name={rest.name}
        defaultValue={""}
        required={rest.required !== false}
        onChange={(event) => handleSelectUser(event.target.value)}
        className="block h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
      >
        {usersOptions.map(({ id, value, label }) => (
          <option key={id} value={value}>
            {label}
          </option>
        ))}
      </select>
      {rest.errors && (
        <InlineErrors
          key={`${rest.name}-error`}
          errorId={`${rest.name}-error`}
          errors={rest.errors}
        />
      )}
      <Signit email={selectedUserEmail} onSignedChange={onSignedChange} />
      <p className="text-base text-slate-800">
        <span className="font-medium">Cargo:</span>{" "}
        <span className="inline-block text-slate-900">
          {position || "No definido"}
        </span>
      </p>
    </div>
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
  handleOption,
}: {
  name: string;
  type: string;
  title?: string;
  initialValue?: string;
  errors?: string[];
  required?: boolean;
  placeholder?: string;
  handleOption?: (name: string, value: string) => void;
}) {
  return (
    <>
      {title && (
        <label
          htmlFor={name}
          className="mb-1.5 mt-3 text-sm font-medium text-gray-900 dark:text-white sm:mb-2 sm:mt-4 block"
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
        className={clsx(
          "w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500",
          STYLES.inputFocus,
        )}
        placeholder={placeholder || title}
        onChange={(e) =>
          handleOption && handleOption(e.target.name, e.target.value)
        }
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
            name={`bool~${name}`}
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
            name={`bool~${name}`}
            title={title || ""}
            isChecked
          />
          <FormSelect
            key={`question-select-${name}`}
            name={`option~${name}`}
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
            name={`option~${name}`}
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
            name={`bool~${name}`}
            title={title || ""}
            isChecked
          />
          <FormSelect
            key={`question-select-${name}`}
            name={`option~${name}`}
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

export function FormDatepicker({
  name,
  title,
  errors,
  initialDate,
  dateStart,
  dateEnd,
  required,
  placeholder,
}: {
  name: string;
  title?: string;
  initialDate?: string;
  dateStart?: string;
  dateEnd?: string;
  errors?: string[];
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      {title && (
        <label
          htmlFor={name}
          className="mb-1.5 mt-3 text-sm font-medium text-gray-900 dark:text-white sm:mb-2 sm:mt-4 block"
        >
          {title}
          {required && <span className="text-red-600"> *</span>}
        </label>
      )}

      <input
        type="date"
        name={name}
        id={name}
        defaultValue={initialDate}
        min={dateStart}
        max={dateEnd}
        className={clsx(
          "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500",
          STYLES.inputFocus,
        )}
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

export function FormUploadFile({
  name,
  title,
  errors,
  required,
  acceptFile,
}: {
  name: string;
  title?: string;
  errors?: string[];
  required?: boolean;
  acceptFile?: string;
}) {
  const [fileName, setFileName] = useState("");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFileName = event.target.files?.[0]?.name || "";
    setFileName(selectedFileName);
  }

  return (
    <div className="space-y-2">
      {title && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold text-slate-800"
        >
          {title}
          {required && <span className="text-rose-600"> *</span>}
        </label>
      )}

      <input
        type="file"
        name={name}
        id={name}
        className="sr-only"
        accept={acceptFile}
        required={required}
        onChange={handleChange}
      />

      <label
        htmlFor={name}
        className={clsx(
          "group flex w-full min-w-0 cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-700",
          STYLES.boxShadow,
          "transition hover:border-rose-300 hover:bg-slate-50/70",
        )}
      >
        <span className="inline-flex w-full min-w-0 items-center gap-2 sm:w-auto sm:flex-1">
          <PaperClipIcon className="h-5 w-5 shrink-0 text-rose-500" />
          <span className="block max-w-full truncate text-slate-600">
            {fileName}
          </span>
        </span>
        <span className="inline-flex w-full items-center justify-center rounded-full border border-white/80 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition group-hover:text-rose-600 sm:w-auto sm:shrink-0">
          {fileName ? "Cambiar archivo" : "Seleccionar"}
        </span>
      </label>

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

export function ChecklistStartButton({
  children = "Comenzar revisión",
  pending,
}: {
  children?: React.ReactNode;
  pending: boolean;
}) {
  return (
    <Button
      type="submit"
      variant="formPrimary"
      className="w-full justify-center sm:col-span-2 sm:w-auto sm:place-self-center"
      isLoading={pending}
      disabled={pending}
    >
      <span>{children}</span>
      <ArrowRightIcon className="h-4 w-4" />
    </Button>
  );
}
