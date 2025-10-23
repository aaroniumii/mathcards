import React from "react";

export default function LanguageSelector({
  language,
  onChange,
  options,
  label,
  helperText,
  className = "",
}) {
  return (
    <div className={`flex flex-col items-end gap-2 text-sm text-sky-700 ${className}`}>
      <label className="font-semibold" htmlFor="language-selector">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <select
          id="language-selector"
          value={language}
          onChange={(event) => onChange(event.target.value)}
          className="rounded-full border-2 border-sky-200 bg-white px-3 py-1 text-sm font-semibold text-sky-700 shadow-inner focus:border-sky-400 focus:outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helperText && <span className="text-xs text-sky-600">{helperText}</span>}
      </div>
    </div>
  );
}
