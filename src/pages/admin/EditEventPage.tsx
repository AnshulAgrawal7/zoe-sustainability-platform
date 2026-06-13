import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Trash2 } from 'lucide-react';
import {
  getEvent,
  updateEvent,
  deleteEvent,
} from '../../services/eventService';
import { getProjects } from '../../services/projectService';
import AutoTranslatePanel from '../../components/admin/AutoTranslatePanel';
import EventFormFields from './EventFormFields';
import { type EventFormState, emptyEventForm } from './eventForm';
import type { ApiProject } from '../../types';

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditEventPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<EventFormState>(emptyEventForm);
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProjects({ status: 'ALL', limit: 50 })
      .then((data) => setProjects(data.projects))
      .catch(() => null);
    getEvent(id)
      .then((ev) =>
        setForm({
          titleEn: ev.titleEn,
          titleEl: ev.titleEl,
          titleDe: ev.titleDe,
          descriptionEn: ev.descriptionEn,
          descriptionEl: ev.descriptionEl,
          descriptionDe: ev.descriptionDe,
          date: toLocalInput(ev.date),
          location: ev.location ?? '',
          lat: ev.lat,
          lng: ev.lng,
          category: ev.category,
          rewardPoints: ev.rewardPoints,
          capacity: ev.capacity ?? '',
          imageUrl: ev.imageUrl ?? '',
          projectId: ev.projectId ?? '',
        })
      )
      .catch(() => setNotFound(true));
  }, [id]);

  function set(field: string, value: string | number | null) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setError('');
    setLoading(true);
    try {
      await updateEvent(id, {
        titleEn: form.titleEn,
        titleEl: form.titleEl,
        titleDe: form.titleDe,
        descriptionEn: form.descriptionEn,
        descriptionEl: form.descriptionEl,
        descriptionDe: form.descriptionDe,
        date: new Date(form.date).toISOString(),
        location: form.location || undefined,
        lat: form.lat,
        lng: form.lng,
        category: form.category,
        rewardPoints: Number(form.rewardPoints),
        capacity: form.capacity ? Number(form.capacity) : null,
        imageUrl: form.imageUrl || null,
        projectId: form.projectId || null,
      });
      navigate('/admin/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!id || !window.confirm(t('adminEvents.deleteConfirm'))) return;
    setLoading(true);
    try {
      await deleteEvent(id);
      navigate('/admin/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
      setLoading(false);
    }
  }

  if (notFound) {
    return (
      <Container className="py-20 text-center">
        <p className="text-gray-500 dark:text-gray-400">{t('common.error')}</p>
        <Link
          to="/admin/events"
          className="mt-2 inline-block font-medium text-green-700 underline dark:text-green-400"
        >
          ← {t('adminEvents.title')}
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <Link
        to="/admin/events"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
      >
        <ChevronLeft size={16} aria-hidden="true" /> {t('common.back')}
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {t('adminEvents.edit')}
      </h1>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <AutoTranslatePanel values={form} onChange={set} />
        <EventFormFields form={form} set={set} projects={projects} />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? t('common.loading') : t('admin.saveChanges')}
          </button>
          <Link
            to="/admin/events"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {t('common.cancel')}
          </Link>
          <button
            type="button"
            onClick={() => void handleDelete()}
            disabled={loading}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 size={15} aria-hidden="true" />
            {t('adminEvents.delete')}
          </button>
        </div>
      </form>
    </Container>
  );
}
