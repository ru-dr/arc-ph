"use client";

import { motion } from "framer-motion";
import { useMediaQuery } from "../../hooks/useIsClient";

export const EASE_OUT = [0.23, 1, 0.32, 1];

export const useMotionSettings = () => {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  return {
    reduced,
    travel: (distance) => (reduced ? 0 : distance),
    duration: (seconds) => (reduced ? 0.35 : seconds),
  };
};

export const Reveal = ({
  as = "div",
  children,
  delay = 0,
  y = 20,
  amount = 0.15,
  className,
  ...rest
}) => {
  const { travel, duration } = useMotionSettings();
  const Component = motion[as] ?? motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: travel(y) }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount, margin: "0px 0px -8% 0px" }}
      transition={{ duration: duration(0.7), ease: EASE_OUT, delay }}
      {...rest}
    >
      {children}
    </Component>
  );
};

export const Intro = ({
  as = "div",
  children,
  delay = 0,
  y = 16,
  duration: customDuration,
  className,
  ...rest
}) => {
  const { travel, duration } = useMotionSettings();
  const Component = motion[as] ?? motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: travel(y) }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: duration(customDuration ?? 0.9),
        ease: EASE_OUT,
        delay,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};

export const MaskedLine = ({ children, delay = 0, className }) => {
  const { reduced, duration } = useMotionSettings();

  return (
    <span className="line-mask">
      <motion.span
        className={className}
        initial={reduced ? { opacity: 0, y: "0%" } : { opacity: 1, y: "108%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ duration: duration(1.05), ease: EASE_OUT, delay }}
        style={{ display: "block" }}
      >
        {children}
      </motion.span>
    </span>
  );
};

export { motion };
