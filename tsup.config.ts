import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/components/extendedTextarea/extendedTextEditor.tsx"], // Входной файл
  format: ["esm", "cjs"], // Форматы сборки
  dts: true, // Генерация типов (если используешь TypeScript)
  splitting: false, // Можно включить, если нужно деление на чанки
  loader: {
    ".svg": "file", // Обрабатывает SVG как файлы
  },
  clean: true, // Удаляет старую сборку перед новой
  onSuccess: 'cpx "public/**/*" dist',
});
