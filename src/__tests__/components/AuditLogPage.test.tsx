import { render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi, describe, test, expect } from 'vitest';
import { TestWrapper } from '../test-utils';
import AuditLogPage from '../../pages/admin/AuditLogPage';
import { api } from '../../services/api';

expect.extend(toHaveNoViolations);

vi.mock('../../services/api', () => ({
  api: { get: vi.fn() },
}));

const mockedGet = vi.mocked(api.get);

const sample = [
  {
    id: 'a1',
    actorEmail: 'admin@zoe-corfu.gr',
    action: 'ROLE_CHANGE',
    targetType: 'USER',
    targetId: 'u9',
    targetLabel: 'maria@example.com',
    detail: 'USER → ADMIN',
    createdAt: '2026-06-17T10:00:00.000Z',
  },
];

describe('AuditLogPage', () => {
  test('renders the audit entries with a localized action label', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedGet.mockResolvedValueOnce({ success: true, data: sample } as any);
    render(
      <TestWrapper>
        <AuditLogPage />
      </TestWrapper>
    );
    expect(await screen.findByText('maria@example.com')).toBeInTheDocument();
    expect(screen.getByText('Role change')).toBeInTheDocument();
    expect(screen.getByText('admin@zoe-corfu.gr')).toBeInTheDocument();
  });

  test('shows the empty state when there are no entries', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedGet.mockResolvedValueOnce({ success: true, data: [] } as any);
    render(
      <TestWrapper>
        <AuditLogPage />
      </TestWrapper>
    );
    expect(
      await screen.findByText(/no admin actions have been logged/i)
    ).toBeInTheDocument();
  });

  test('has no accessibility violations', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedGet.mockResolvedValueOnce({ success: true, data: sample } as any);
    const { container } = render(
      <TestWrapper>
        <AuditLogPage />
      </TestWrapper>
    );
    await waitFor(() =>
      expect(screen.getByText('maria@example.com')).toBeInTheDocument()
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
