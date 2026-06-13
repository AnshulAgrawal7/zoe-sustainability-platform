import { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react';
import { createEvent } from '../../services/eventService';
import { getProjects } from '../../services/projectService';
import {
  getEventProposal,
  updateEventProposal,
} from '../../services/eventProposalService';
import { translateFields } from '../../services/translationService';
import AutoTranslatePanel from '../../components/admin/AutoTranslatePanel';
import EventFormFields from './EventFormFields';
import { type EventFormState, emptyEventForm } from './eventForm';
import type { ApiProject, UserLanguage } from '../../types';

const SFX: Record<UserLanguage, 'En' | 'El' | 'De'> = {
  EN: 'En',
  EL: 'El',
  DE: 'De',
};

// `2026-09-13T09:00:00.000Z` → `2026-09-13T09:00` for <input type="datetime-local">.
function toLocalInput(iso: string): string {
  return new Date(iso).toISOString().slice(0, 16);
}

export default function NewEventPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get('fromProposal');

  const [form, setForm] = useState<EventFormState>(emptyEventForm);
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [prefilling, setPrefilling] = useState(Boolean(proposalId));

  useEffect(() => {
    getProjects({ status: 'ALL', limit: 50 })
      .then((data) => setProjects(data.projects))
      .catch(() => null);
  }, []);

  // Pre-fill from a citizen event proposal: the source language is placed in its
  // own fields and auto-translated (DeepL) into the other two for the admin to
  // review before saving.
  useEffect(() => {
    if (!proposalId) return;
    let cancelled = false;
    async function prefill() {
      try {
        const p = await getEventProposal(proposalId!);
        if (cancelled) return;
        const lang = (p.lang as UserLanguage) ?? 'EN';
        const next: EventFormState = {
          ...emptyEventForm,
          category: p.category,
          date: toLocalInput(p.date),
          location: p.location ?? '',
          lat: p.lat,
          lng: p.lng,
          capacity: p.capacity ?? '',
          rewardPoints: p.rewardPoints ?? 20,
          imageUrl: p.imageUrl ?? '',
          projectId: p.projectId ?? '',
          [`title${SFX[lang]}`]: p.title,
          [`description${SFX[lang]}`]: p.description,
        };
        // Best-effort auto-translation into the other two languages.
        try {
          const result = await translateFields(
            { title: p.title, description: p.description },
            lang
          );
          for (const [tl, fields] of Object.entries(result.translations)) {
            const sfx = SFX[tl as UserLanguage];
            if (!sfx) continue;
            if (typeof fields.title === 'string')
              next[`title${sfx}`] = fields.title;
            if (typeof fields.description === 'string')
              next[`description${sfx}`] = fields.description;
          }
        } catch {
          /* translation optional — admin can fill the gaps manually */
        }
        if (!cancelled) setForm(next);
      } catch {
        if (!cancelled) setError(t('adminEventProposals.loadError'));
      } finally {
        if (!cancelled) setPrefilling(false);
      }
    }
    void prefill();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalId]);

  function set(field: string, value: string | number | null) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titleEn || !form.titleEl || !form.titleDe) {
      setError(t('admin.validationTitlesRequired'));
      return;
    }
    if (!form.descriptionEn || !form.descriptionEl || !form.descriptionDe) {
      setError(t('admin.validationDescriptionsRequired'));
      return;
    }
    if (!form.date) {
      setError(t('adminEvents.validationDateRequired'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      const created = await createEvent({
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
        imageUrl: form.imageUrl || undefined,
        projectId: form.projectId || null,
      });
      // Mark the source proposal as converted so it leaves the review queue.
      if (proposalId) {
        await updateEventProposal(proposalId, 'CONVERTED', created.id).catch(
          () => null
        );
      }
      navigate('/admin/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="py-8">
      <Link
        to={proposalId ? '/admin/event-proposals' : '/admin/events'}
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
      >
        <ChevronLeft size={16} aria-hidden="true" /> {t('common.back')}
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {proposalId
          ? t('adminEventProposals.reviewTitle')
          : t('adminEvents.create')}
      </h1>

      {proposalId && (
        <p className="mb-4 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800 dark:border-teal-800 dark:bg-teal-900/20 dark:text-teal-200">
          {t('adminEventProposals.prefillNote')}
        </p>
      )}

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {prefilling ? (
        <p className="text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <AutoTranslatePanel values={form} onChange={set} />
          <EventFormFields form={form} set={set} projects={projects} />

          <div className="flex gap-3">
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
          </div>
        </form>
      )}
    </Container>
  );
}
