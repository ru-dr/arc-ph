"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "../../hooks/useIsClient";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const cx = (...parts) => parts.filter(Boolean).join(" ");

const SPINNER_SIZE = { sm: 16, md: 22, lg: 32 };

export const Spinner = ({ size = "md", className, label }) => (
  <span role="status" aria-live="polite" className={cx("inline-flex items-center gap-2", className)}>
    <Loader2
      size={SPINNER_SIZE[size] ?? SPINNER_SIZE.md}
      className="animate-spin text-[var(--ink-soft)]"
      style={{ animationDuration: "700ms" }}
      aria-hidden="true"
    />
    <span className="sr-only">{label || "Loading"}</span>
  </span>
);

const BUTTON_BASE =
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap select-none " +
  "font-medium transition-[transform,background-color,color,border-color,opacity] " +
  "duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] " +
  "disabled:pointer-events-none disabled:opacity-45";

const BUTTON_COLOR = {
  primary:
    "bg-[var(--ink)] text-[var(--paper)] border border-[var(--ink)] hover:bg-[#2a2820]",
  default:
    "bg-transparent text-[var(--ink)] border border-[var(--edge)] hover:border-[var(--ink)]",
  secondary:
    "bg-transparent text-[var(--ink)] border border-[var(--edge)] hover:border-[var(--ink)]",
  danger:
    "bg-[#8a2318] text-[#f7f3ec] border border-[#8a2318] hover:bg-[#701c13]",
  light:
    "bg-transparent text-[var(--ink)] border border-transparent hover:bg-[var(--paper-2)]",
};

const BUTTON_SIZE = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

const ICON_SIZE = { sm: "h-8 w-8 p-0", md: "h-10 w-10 p-0", lg: "h-12 w-12 p-0" };

export const Button = React.forwardRef(function Button(
  {
    children,
    color = "default",
    variant,
    size = "md",
    isIconOnly = false,
    isLoading = false,
    startContent,
    endContent,
    className,
    type = "button",
    onPress,
    onClick,
    disabled,
    ...rest
  },
  ref
) {
  const tone = variant === "light" && color === "default" ? "light" : color;
  const handleClick = (event) => {
    onClick?.(event);
    onPress?.(event);
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      onClick={handleClick}
      className={cx(
        BUTTON_BASE,
        BUTTON_COLOR[tone] ?? BUTTON_COLOR.default,
        isIconOnly ? ICON_SIZE[size] : BUTTON_SIZE[size],
        className
      )}
      {...rest}
    >
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <>
          {startContent}
          {children}
          {endContent}
        </>
      )}
    </button>
  );
});

export const Input = React.forwardRef(function Input(
  {
    label,
    description,
    helperText,
    errorMessage,
    startContent,
    contentLeft,
    endContent,
    className,
    classNames = {},
    id,
    isRequired,
    required,
    fullWidth,
    variant,
    color,
    clearable,
    size,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || rest.name || generatedId;
  const lead = startContent ?? contentLeft;
  const isInvalid = Boolean(errorMessage);

  return (
    <div className={cx("w-full", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-xs font-medium tracking-[0.01em] text-[var(--ink-soft)]"
        >
          {label}
          {(isRequired || required) && <span className="ml-1 text-[#8a2318]">*</span>}
        </label>
      )}
      <div
        className={cx(
          "flex items-center gap-2 border bg-[var(--paper)] px-3",
          "transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]",
          "focus-within:border-[var(--ink)]",
          isInvalid ? "border-[#8a2318]" : "border-[var(--edge)]",
          classNames.inputWrapper
        )}
      >
        {lead && <span className="text-[var(--ink-soft)]">{lead}</span>}
        <input
          ref={ref}
          id={inputId}
          required={isRequired || required}
          aria-invalid={isInvalid || undefined}
          aria-describedby={helperText || errorMessage ? `${inputId}-hint` : undefined}
          className={cx(
            "h-11 w-full bg-transparent text-sm text-[var(--ink)] outline-none",
            "placeholder:text-[var(--ink-soft)]/70 disabled:opacity-50",
            classNames.input
          )}
          {...rest}
        />
        {endContent}
      </div>
      {(errorMessage || helperText || description) && (
        <p
          id={`${inputId}-hint`}
          className={cx(
            "mt-1.5 text-xs",
            isInvalid ? "text-[#8a2318]" : "text-[var(--ink-soft)]"
          )}
        >
          {errorMessage || helperText || description}
        </p>
      )}
    </div>
  );
});

export const Checkbox = ({
  children,
  isSelected,
  checked,
  onChange,
  name,
  value,
  className,
  radius,
  ...rest
}) => (
  <label
    className={cx(
      "group flex cursor-pointer items-center gap-3 text-sm text-[var(--ink)]",
      className
    )}
  >
    <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={isSelected ?? checked ?? false}
        onChange={onChange}
        className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
        {...rest}
      />
      <span
        aria-hidden="true"
        className={cx(
          "h-5 w-5 border border-[var(--edge)] bg-[var(--paper)]",
          "transition-[background-color,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]",
          "peer-checked:border-[var(--ink)] peer-checked:bg-[var(--ink)]",
          "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--ink)]"
        )}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="pointer-events-none absolute h-3 w-3 scale-90 text-[var(--paper)] opacity-0 transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] peer-checked:scale-100 peer-checked:opacity-100"
      >
        <path
          d="M2 8.5 6 12.5 14 3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
    <span>{children}</span>
  </label>
);

export const Tooltip = ({
  content,
  children,
  placement = "top",
  isOpen,
  onOpenChange,
  className,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = isOpen ?? uncontrolledOpen;

  const setOpen = useCallback(
    (next) => {
      if (isOpen === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isOpen, onOpenChange]
  );

  const position =
    placement === "bottom"
      ? "top-full mt-2 left-1/2 -translate-x-1/2 origin-top"
      : "bottom-full mb-2 left-1/2 -translate-x-1/2 origin-bottom";

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <span
        role="tooltip"
        className={cx(
          "pointer-events-none absolute z-50 w-max max-w-xs",
          "border border-[var(--rule)] bg-[var(--paper)] px-2.5 py-1.5 text-xs text-[var(--ink)]",
          "shadow-[0_8px_24px_-12px_rgba(22,21,15,0.5)]",
          "transition-[opacity,transform] duration-125 ease-[cubic-bezier(0.23,1,0.32,1)]",
          position,

          open
            ? "scale-100 opacity-100 delay-300"
            : "scale-[0.97] opacity-0 delay-0",
          className
        )}
      >
        {content}
      </span>
    </span>
  );
};

const CHIP_COLOR = {
  default: "border-[var(--edge)] text-[var(--ink)]",
  primary: "border-[var(--ink)] text-[var(--ink)]",
  warning: "border-[#a8712c] text-[#8a5a1f]",
  success: "border-[#4c6b3c] text-[#3f5a31]",
  danger: "border-[#8a2318] text-[#8a2318]",
};

export const Chip = ({
  children,
  color = "default",
  startContent,
  className,
  size,
  variant,
  ...rest
}) => (
  <span
    className={cx(
      "inline-flex items-center gap-1.5 border bg-[var(--paper)]/80 px-2.5 py-1 text-xs",
      CHIP_COLOR[color] ?? CHIP_COLOR.default,
      className
    )}
    {...rest}
  >
    {startContent}
    {children}
  </span>
);

export const Card = ({ children, className, ...rest }) => (
  <section className={cx("border border-[var(--rule)] bg-[var(--paper)]", className)} {...rest}>
    {children}
  </section>
);

export const CardBody = ({ children, className, ...rest }) => (
  <div className={cx("p-5 md:p-6", className)} {...rest}>
    {children}
  </div>
);

export const Pagination = ({ total, page, onChange, className }) => {
  if (!total || total < 2) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className={cx("flex items-center gap-1", className)}>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        aria-label="Previous page"
        disabled={page <= 1}
        onPress={() => onChange(Math.max(1, page - 1))}
      >
        <ChevronLeft size={16} />
      </Button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          aria-current={p === page ? "page" : undefined}
          onClick={() => onChange(p)}
          className={cx(
            "h-8 min-w-8 px-2 text-xs transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
            p === page
              ? "bg-[var(--ink)] text-[var(--paper)]"
              : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
          )}
        >
          {p}
        </button>
      ))}
      <Button
        isIconOnly
        size="sm"
        variant="light"
        aria-label="Next page"
        disabled={page >= total}
        onPress={() => onChange(Math.min(total, page + 1))}
      >
        <ChevronRight size={16} />
      </Button>
    </nav>
  );
};

export const useDisclosure = () => {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onOpenChange: (next) => setIsOpen((prev) => (typeof next === "boolean" ? next : !prev)),
  };
};

const ModalContext = createContext({ onClose: () => {} });

export const Modal = ({ isOpen, onOpenChange, children, className }) => {
  const isClient = useIsClient();
  const panelRef = useRef(null);
  const onClose = useCallback(() => onOpenChange?.(false), [onOpenChange]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isClient) return null;

  return createPortal(
    <div className="modal-layer" data-open={isOpen ? "true" : "false"}>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cx("modal-panel", className)}
      >
        <ModalContext.Provider value={{ onClose }}>{children}</ModalContext.Provider>
      </div>
    </div>,
    document.body
  );
};

export const ModalContent = ({ children }) => {
  const { onClose } = useContext(ModalContext);
  return typeof children === "function" ? children(onClose) : children;
};

export const ModalHeader = ({ children, className }) => (
  <header className={cx("px-6 pt-6 pb-2 text-lg display-sm", className)}>{children}</header>
);

export const ModalBody = ({ children, className }) => (
  <div className={cx("px-6 py-2 text-sm leading-relaxed text-[var(--ink-soft)]", className)}>
    {children}
  </div>
);

export const ModalFooter = ({ children, className }) => (
  <footer className={cx("flex justify-end gap-2 px-6 pb-6 pt-4", className)}>{children}</footer>
);

export const Tabs = ({ children, className, "aria-label": ariaLabel }) => {
  const items = React.Children.toArray(children).filter(Boolean);
  const [active, setActive] = useState(items[0]?.key ?? 0);
  const current = items.find((item, i) => (item.key ?? i) === active) ?? items[0];

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="mb-6 flex gap-6 border-b border-[var(--rule)]"
      >
        {items.map((item, i) => {
          const key = item.key ?? i;
          const selected = key === active;
          return (
            <button
              key={key}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setActive(key)}
              className={cx(
                "relative -mb-px pb-3 text-sm transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]",
                selected ? "text-[var(--ink)]" : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
              )}
            >
              {item.props.title}
              <span
                aria-hidden="true"
                className={cx(
                  "absolute inset-x-0 bottom-0 h-px origin-left bg-[var(--ink)]",
                  "transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
                  selected ? "scale-x-100" : "scale-x-0"
                )}
              />
            </button>
          );
        })}
      </div>
      <div role="tabpanel">{current?.props.children}</div>
    </div>
  );
};

export const Tab = ({ children }) => <>{children}</>;

export const Image = ({ src, alt = "", className, ...rest }) => {
  if (!src) {
    return (
      <div
        className={cx(
          "flex h-full w-full items-center justify-center bg-[var(--paper-2)] text-xs text-[var(--ink-soft)]",
          className
        )}
      >
        No image
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} {...rest} />;
};
