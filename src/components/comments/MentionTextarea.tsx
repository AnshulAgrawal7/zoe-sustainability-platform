import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { searchUsernames } from '../../services/userService';

interface Props {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  'aria-label'?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

// Textarea with @username autocomplete. While the caret sits inside an
// "@partial" token, it queries the username search and offers matches; picking
// one (click or Enter) inserts "@username ". Keyboard accessible.
export default function MentionTextarea({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  ...aria
}: Props) {
  const { t } = useTranslation();
  const ref = useRef<HTMLTextAreaElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const queryRef = useRef<string>('');
  const timerRef = useRef<number | undefined>(undefined);

  // The "@word" immediately before a caret position, or null when not mentioning.
  function mentionAt(
    text: string,
    caret: number
  ): { query: string; start: number } | null {
    const upto = text.slice(0, caret);
    const match = /(?:^|\s)@([a-z0-9_]*)$/i.exec(upto);
    if (!match) return null;
    return { query: match[1].toLowerCase(), start: caret - match[1].length };
  }

  function currentMention(): { query: string; start: number } | null {
    const el = ref.current;
    if (!el) return null;
    return mentionAt(value, el.selectionStart ?? value.length);
  }

  const runSearch = useCallback((q: string) => {
    queryRef.current = q;
    searchUsernames(q)
      .then((users) => {
        if (queryRef.current !== q) return; // ignore out-of-order responses
        setSuggestions(users.map((u) => u.username));
        setActive(0);
        setOpen(users.length > 0);
      })
      .catch(() => setOpen(false));
  }, []);

  // Debounced lookup driven by the change event (not an effect) so we never call
  // setState synchronously during render/commit.
  function scheduleSearch(text: string, caret: number) {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const mention = mentionAt(text, caret);
      if (!mention) {
        setOpen(false);
        return;
      }
      runSearch(mention.query);
    }, 180);
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
    scheduleSearch(
      e.target.value,
      e.target.selectionStart ?? e.target.value.length
    );
  }

  function insert(username: string) {
    const el = ref.current;
    const caret = el?.selectionStart ?? value.length;
    const mention = currentMention();
    if (!mention) return;
    const before = value.slice(0, mention.start - 1); // drop the "@"
    const after = value.slice(caret);
    const next = `${before}@${username} ${after}`;
    onChange(next);
    setOpen(false);
    // Restore focus + caret after the inserted handle.
    requestAnimationFrame(() => {
      const pos = before.length + username.length + 2;
      el?.focus();
      el?.setSelectionRange(pos, pos);
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      insert(suggestions[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <textarea
        id={id}
        ref={ref}
        rows={rows}
        value={value}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label={aria['aria-label']}
        aria-invalid={aria['aria-invalid']}
        aria-describedby={aria['aria-describedby']}
        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />
      {open && (
        <ul
          role="listbox"
          aria-label={t('mentions.suggestionsAria')}
          className="absolute z-20 mt-1 max-h-48 w-56 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          {suggestions.map((u, i) => (
            <li key={u} role="option" aria-selected={i === active}>
              <button
                type="button"
                // Use onMouseDown so the textarea does not blur before we insert.
                onMouseDown={(e) => {
                  e.preventDefault();
                  insert(u);
                }}
                className={`block w-full px-3 py-1.5 text-left text-sm ${
                  i === active
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                @{u}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
