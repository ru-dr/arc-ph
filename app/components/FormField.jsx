import React from "react";
import { Input, Tooltip } from "./ui";
import { Info } from "lucide-react";

const FormField = ({
  label,
  name,
  value,
  onChange,
  error,
  required,
  type = "text",
  description,
  classNames = {},
  ...rest
}) => (
  <div className="mb-4">
    <Input
      label={label}
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      isRequired={required}
      errorMessage={error}
      classNames={classNames}
      endContent={
        description ? (
          <Tooltip content={description}>
            <span className="text-ink-soft" tabIndex={0} aria-label={description}>
              <Info size={16} aria-hidden="true" />
            </span>
          </Tooltip>
        ) : null
      }
      {...rest}
    />
  </div>
);

export default FormField;
