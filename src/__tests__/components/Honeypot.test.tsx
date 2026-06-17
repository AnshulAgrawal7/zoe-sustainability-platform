import { render, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { TestWrapper } from '../test-utils';
import IdeaSubmitForm from '../../components/engagement/IdeaSubmitForm';
import { HONEYPOT_FIELD } from '../../components/ui/HoneypotField';
import * as ideaService from '../../services/ideaService';

vi.mock('../../services/ideaService', () => ({
  submitIdea: vi.fn(() => Promise.resolve()),
}));

const mockedSubmit = vi.mocked(ideaService.submitIdea);

function fillRequired(container: HTMLElement) {
  fireEvent.change(container.querySelector('#idea-title') as HTMLInputElement, {
    target: { value: 'More bike lanes' },
  });
  fireEvent.change(
    container.querySelector('#idea-category') as HTMLSelectElement,
    { target: { value: 'MOBILITY' } }
  );
  fireEvent.change(
    container.querySelector('#idea-message') as HTMLTextAreaElement,
    { target: { value: 'A safe cycling route along the coast.' } }
  );
}

describe('Honeypot field on public forms', () => {
  beforeEach(() => mockedSubmit.mockClear());

  test('renders an off-screen, aria-hidden honeypot input', () => {
    const { container } = render(
      <TestWrapper>
        <IdeaSubmitForm onClose={() => {}} />
      </TestWrapper>
    );
    const input = container.querySelector(
      `input[name="${HONEYPOT_FIELD}"]`
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.tabIndex).toBe(-1);
    // Removed from the accessibility tree via an aria-hidden wrapper.
    expect(input.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  test('sends an empty honeypot for a genuine submission', async () => {
    const { container } = render(
      <TestWrapper>
        <IdeaSubmitForm onClose={() => {}} />
      </TestWrapper>
    );
    fillRequired(container);
    fireEvent.click(
      container.querySelector('button[type="submit"]') as HTMLButtonElement
    );
    await waitFor(() => expect(mockedSubmit).toHaveBeenCalledTimes(1));
    expect(mockedSubmit.mock.calls[0]?.[0]).toMatchObject({ website: '' });
  });
});
