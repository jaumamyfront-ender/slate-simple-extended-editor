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
});
