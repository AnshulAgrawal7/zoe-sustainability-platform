import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { TestWrapper } from '../test-utils';
import ManageNewsletterPage from '../../pages/admin/ManageNewsletterPage';
import * as service from '../../services/newsletterService';

expect.extend(toHaveNoViolations);

vi.mock('../../services/newsletterService', () => ({
  getNewsletterSignups: vi.fn(),
  deleteNewsletterSignup: vi.fn(() => Promise.resolve()),
  exportNewsletterSignups: vi.fn(() => Promise.resolve()),
}));

const mockedGet = vi.mocked(service.getNewsletterSignups);
const mockedDelete = vi.mocked(service.deleteNewsletterSignup);

const sample = [
  {
    id: 'n1',
    email: 'maria@example.com',
    locale: 'el',
    createdAt: '2026-06-17T08:00:00.000Z',
  },
  {
    id: 'n2',
    email: 'kostas@example.com',
    locale: 'en',
    createdAt: '2026-06-16T08:00:00.000Z',
  },
];

describe('ManageNewsletterPage', () => {
  beforeEach(() => {
    mockedDelete.mockClear();
    mockedGet.mockResolvedValue({ signups: sample, total: 2 });
  });

  test('lists stored signups', async () => {
    render(
      <TestWrapper>
        <ManageNewsletterPage />
      </TestWrapper>
    );
    expect(await screen.findByText('maria@example.com')).toBeInTheDocument();
    expect(screen.getByText('kostas@example.com')).toBeInTheDocument();
  });

  test('requires a second click to confirm deletion', async () => {
    render(
      <TestWrapper>
        <ManageNewsletterPage />
      </TestWrapper>
    );
    await screen.findByText('maria@example.com');
    const delBtn = screen.getByLabelText(/delete signup maria@example.com/i);
    // First click arms (no service call yet).
    fireEvent.click(delBtn);
    expect(mockedDelete).not.toHaveBeenCalled();
    // Second click confirms.
    fireEvent.click(delBtn);
    await waitFor(() => expect(mockedDelete).toHaveBeenCalledWith('n1'));
  });

  test('shows the empty state', async () => {
    mockedGet.mockResolvedValueOnce({ signups: [], total: 0 });
    render(
      <TestWrapper>
        <ManageNewsletterPage />
      </TestWrapper>
    );
    expect(
      await screen.findByText(/no newsletter signups yet/i)
    ).toBeInTheDocument();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <TestWrapper>
        <ManageNewsletterPage />
      </TestWrapper>
    );
    await screen.findByText('maria@example.com');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
