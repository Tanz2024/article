import { useState } from "react";

const languages = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "es", label: "Español" },
];

export default function LanguageSwitcher({ onChange, value }: { onChange: (lang: string) => void; value: string }) {
  return (
    <select
      className="border rounded px-2 py-1 bg-white text-accent dark:bg-accent dark:text-white"
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label="Select language"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
