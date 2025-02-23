import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/components/extendedTextarea/extendedTextEditor.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  loader: {
    ".svg": "file",
  },
  clean: true,
  minify: false, // Disable minification
  treeshake: false, // Disable tree shaking
  sourcemap: true, // Keep the code readable with source maps
  keepNames: true, // Preserve function and class names
});
