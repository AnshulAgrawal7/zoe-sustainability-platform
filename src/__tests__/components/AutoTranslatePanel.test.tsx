import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, type Mock } from 'vitest';
import { TestWrapper } from '../test-utils';
import AutoTranslatePanel from '../../components/admin/AutoTranslatePanel';

vi.mock('../../services/translationService', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../services/translationService')>();
  return { ...actual, translateFields: vi.fn() };
});

import { translateFields } from '../../services/translationService';
const mockTranslate = translateFields as Mock;

afterEach(() => mockTranslate.mockReset());

const FILLED = {
  titleEn: 'Hello',
  descriptionEn: 'World',
  titleEl: '',
  titleDe: '',
  descriptionEl: '',
  descriptionDe: '',
};

test('fills the other languages from the translation result', async () => {
  mockTranslate.mockResolvedValue({
    sourceLang: 'EN',
    translations: {
      EL: { title: 'Γεια', description: 'Κόσμος' },
      DE: { title: 'Hallo', description: 'Welt' },
    },
  });
  const onChange = vi.fn();
  render(
    <TestWrapper>
      <AutoTranslatePanel values={FILLED} onChange={onChange} />
    </TestWrapper>
  );
  fireEvent.click(
    screen.getByRole('button', { name: /translate to the other languages/i })
  );
  await waitFor(() =>
    expect(onChange).toHaveBeenCalledWith('titleDe', 'Hallo')
  );
  expect(onChange).toHaveBeenCalledWith('descriptionDe', 'Welt');
  expect(onChange).toHaveBeenCalledWith('titleEl', 'Γεια');
  expect(onChange).toHaveBeenCalledWith('descriptionEl', 'Κόσμος');
});

test('warns instead of calling the API when the source fields are empty', () => {
  const onChange = vi.fn();
  render(
    <TestWrapper>
      <AutoTranslatePanel values={{}} onChange={onChange} />
    </TestWrapper>
  );
  fireEvent.click(
    screen.getByRole('button', { name: /translate to the other languages/i })
  );
  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(mockTranslate).not.toHaveBeenCalled();
  expect(onChange).not.toHaveBeenCalled();
});

test('shows a friendly message when translation is not configured', async () => {
  mockTranslate.mockRejectedValue(new Error('translation_not_configured'));
  render(
    <TestWrapper>
      <AutoTranslatePanel values={FILLED} onChange={vi.fn()} />
    </TestWrapper>
  );
  fireEvent.click(
    screen.getByRole('button', { name: /translate to the other languages/i })
  );
  expect(await screen.findByRole('alert')).toHaveTextContent(/not configured/i);
});
