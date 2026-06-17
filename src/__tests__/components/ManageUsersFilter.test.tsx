import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import { TestWrapper } from '../test-utils';
import ManageUsersPage from '../../pages/admin/ManageUsersPage';
import { api } from '../../services/api';

vi.mock('../../services/api', () => ({
  api: { get: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

const mockedGet = vi.mocked(api.get);

const users = [
  {
    id: 'u1',
    email: 'maria@example.com',
    username: 'maria_p',
    name: 'Maria P',
    role: 'USER',
    active: true,
    points: 10,
    language: 'EL',
    createdAt: '2026-01-01',
    _count: { participations: 0, userBadges: 0 },
  },
  {
    id: 'u2',
    email: 'admin@zoe.gr',
    username: 'zoe_admin',
    name: 'ZOE Admin',
    role: 'ADMIN',
    active: true,
    points: 0,
    language: 'EN',
    createdAt: '2026-01-02',
    _count: { participations: 0, userBadges: 0 },
  },
  {
    id: 'u3',
    email: 'kostas@example.com',
    username: 'kostas_v',
    name: 'Kostas V',
    role: 'USER',
    active: false,
    points: 5,
    language: 'EL',
    createdAt: '2026-01-03',
    _count: { participations: 0, userBadges: 0 },
  },
];

describe('ManageUsersPage search & filters', () => {
  test('filters by search query (name/email/username)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedGet.mockResolvedValue({ success: true, data: users } as any);
    render(
      <TestWrapper>
        <ManageUsersPage />
      </TestWrapper>
    );
    expect(await screen.findByText('Maria P')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'kostas' },
    });
    await waitFor(() =>
      expect(screen.queryByText('Maria P')).not.toBeInTheDocument()
    );
    expect(screen.getByText('Kostas V')).toBeInTheDocument();
  });

  test('filters by status (suspended only)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedGet.mockResolvedValue({ success: true, data: users } as any);
    render(
      <TestWrapper>
        <ManageUsersPage />
      </TestWrapper>
    );
    await screen.findByText('Maria P');
    const statusSelect = screen.getAllByRole(
      'combobox'
    )[1] as HTMLSelectElement;
    fireEvent.change(statusSelect, { target: { value: 'suspended' } });
    await waitFor(() =>
      expect(screen.queryByText('Maria P')).not.toBeInTheDocument()
    );
    expect(screen.getByText('Kostas V')).toBeInTheDocument();
  });
});
