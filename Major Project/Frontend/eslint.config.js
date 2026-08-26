import js from "@eslint/js";
import react from "eslint-plugin-react";

export default [
  js.configs.recommended,
  {
    plugins: { react },
    rules: { "react/prop-types": "off" },
    settings: { react: { version: "detect" } },
  },
];
