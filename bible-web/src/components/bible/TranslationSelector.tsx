import { Translation } from "@/lib/types/bible";
import { Select } from "@/components/common/Select";

interface TranslationSelectorProps {
  translations: Translation[];
  value: string;
  onChange: (value: string) => void;
}

export function TranslationSelector({ translations, value, onChange }: TranslationSelectorProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-[var(--ink-700)]" htmlFor="translation">
        Translation
      </label>
      <Select id="translation" value={value} onChange={(event) => onChange(event.target.value)}>
        {translations.map((translation) => (
          <option key={translation.code} value={translation.code}>
            {translation.name} ({translation.code})
          </option>
        ))}
      </Select>
    </div>
  );
}
