import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**"],
  },
  ...nextCoreWebVitals,
  {
    files: ["app/components/ui/index.jsx"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
