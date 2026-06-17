import { useState } from 'react';

// Must match the backend honeypot middleware field name
// (`backend/src/middleware/honeypot.ts`).
export const HONEYPOT_FIELD = 'website';

// Small hook so a form just does `const honeypot = useHoneypot()` and sends
// `honeypot.value` in its payload.
export function useHoneypot() {
  const [value, setValue] = useState('');
  return {
    value,
    /** Spread onto <HoneypotField {...honeypot.fieldProps} /> */
    fieldProps: { value, onChange: setValue },
  };
}

interface HoneypotFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Anti-spam honeypot — an off-screen text input that a real user never sees,
 * focuses or fills. Automated form-spam bots that blindly populate every field
 * give themselves away; the backend then silently drops the submission.
 *
 * Hidden via off-screen positioning (not `display:none`, which some bots skip),
 * removed from the tab order (`tabIndex={-1}`) and from the accessibility tree
 * (`aria-hidden`), with autofill disabled so browsers never pre-fill it.
 */
export default function HoneypotField({ value, onChange }: HoneypotFieldProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
    >
      <input
        type="text"
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
