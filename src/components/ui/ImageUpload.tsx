import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Loader2, X, Link as LinkIcon } from 'lucide-react';
import { uploadEntityImage } from '../../services/uploadService';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label: string;
  id?: string;
}

const MAX_BYTES = 5 * 1024 * 1024;

// Cover-image picker: upload a file from the device (stored in Supabase Storage,
// returns a public URL) OR paste an external URL. Shows a preview either way.
export default function ImageUpload({
  value,
  onChange,
  label,
  id = 'image',
}: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file: File) {
    setError('');
    if (file.size > MAX_BYTES) {
      setError(t('imageUpload.tooLarge'));
      return;
    }
    setUploading(true);
    try {
      const url = await uploadEntityImage(file);
      onChange(url);
    } catch {
      setError(t('imageUpload.failed'));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </span>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-green-400 hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        >
          {uploading ? (
            <Loader2
              size={15}
              aria-hidden="true"
              className="animate-spin motion-reduce:animate-none"
            />
          ) : (
            <Upload size={15} aria-hidden="true" />
          )}
          {uploading ? t('imageUpload.uploading') : t('imageUpload.choose')}
        </button>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = '';
          }}
        />
      </div>

      {/* URL fallback (e.g. an external image). */}
      <div className="mt-2">
        <label htmlFor={`${id}-url`} className="sr-only">
          {t('imageUpload.urlLabel')}
        </label>
        <div className="relative">
          <LinkIcon
            size={14}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            id={`${id}-url`}
            type="url"
            inputMode="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://…/image.jpg"
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-1 text-xs text-rose-600 dark:text-rose-400"
        >
          {error}
        </p>
      )}

      {value && (
        <div className="mt-2">
          <img
            src={value}
            alt=""
            className="h-28 w-full rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-red-400"
          >
            <X size={12} aria-hidden="true" />
            {t('imageUpload.remove')}
          </button>
        </div>
      )}
    </div>
  );
}
