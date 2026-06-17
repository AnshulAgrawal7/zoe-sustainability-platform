import { render, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { TestWrapper } from '../test-utils';
import IdeaSubmitForm from '../../components/engagement/IdeaSubmitForm';
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

describe('IdeaSubmitForm optional email validation', () => {
  beforeEach(() => mockedSubmit.mockClear());

  test('blocks submission and flags an invalid email', async () => {
    const { container } = render(
      <TestWrapper>
        <IdeaSubmitForm onClose={() => {}} />
      </TestWrapper>
    );
    fillRequired(container);
    fireEvent.change(
      container.querySelector('#idea-email') as HTMLInputElement,
      {
        target: { value: 'not-an-email' },
      }
    );
    fireEvent.click(
      container.querySelector('button[type="submit"]') as HTMLButtonElement
    );

    await waitFor(() =>
      expect(container.querySelector('#idea-email-err')).toBeInTheDocument()
    );
    expect(mockedSubmit).not.toHaveBeenCalled();
  });

  test('submits when the optional email is left empty', async () => {
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
    expect(mockedSubmit.mock.calls[0]?.[0]).toMatchObject({
      submitterEmail: undefined,
    });
  });

  test('submits with a valid email', async () => {
    const { container } = render(
      <TestWrapper>
        <IdeaSubmitForm onClose={() => {}} />
      </TestWrapper>
    );
    fillRequired(container);
    fireEvent.change(
      container.querySelector('#idea-email') as HTMLInputElement,
      {
        target: { value: 'maria@example.com' },
      }
    );
    fireEvent.click(
      container.querySelector('button[type="submit"]') as HTMLButtonElement
    );

    await waitFor(() => expect(mockedSubmit).toHaveBeenCalledTimes(1));
    expect(mockedSubmit.mock.calls[0]?.[0]).toMatchObject({
      submitterEmail: 'maria@example.com',
    });
  });
});
