import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../utils/i18n';
import TwoFactorSettings from '../../components/auth/TwoFactorSettings';
import LoginPage from '../../pages/auth/LoginPage';
import * as authService from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import type { AuthUser } from '../../types';

vi.mock('qrcode', () => ({
  default: { toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,QR') },
}));

vi.mock('../../services/authService', () => ({
  setupTwoFactor: vi.fn(),
  enableTwoFactor: vi.fn(),
  disableTwoFactor: vi.fn(),
  login: vi.fn(),
}));

const mocked = vi.mocked(authService);

function wrap(node: React.ReactNode) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>{node}</MemoryRouter>
    </I18nextProvider>
  );
}

const user = (over: Partial<AuthUser>): AuthUser =>
  ({
    id: 'u1',
    email: 'u@e.gr',
    username: 'u1',
    name: 'U',
    role: 'USER',
    points: 0,
    avatarUrl: null,
    language: 'EN',
    profile: 'RESIDENT',
    ...over,
  }) as AuthUser;

describe('TwoFactorSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: user({ twoFactorEnabled: false }) });
  });

  test('runs the setup → enable flow and reveals backup codes', async () => {
    mocked.setupTwoFactor.mockResolvedValue({
      secret: 'JBSWY3DPEHPK3PXP',
      otpauthUrl: 'otpauth://totp/ZOE:u@e.gr?secret=JBSWY3DPEHPK3PXP',
    });
    mocked.enableTwoFactor.mockResolvedValue(['aaaa-1111', 'bbbb-2222']);

    wrap(<TwoFactorSettings />);
    fireEvent.click(screen.getByRole('button', { name: /set up two-factor/i }));

    await waitFor(() => expect(mocked.setupTwoFactor).toHaveBeenCalled());
    // Secret shown for manual entry.
    expect(await screen.findByText(/JBSWY3DPEHPK3PXP/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/authentication code/i), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => expect(mocked.enableTwoFactor).toHaveBeenCalledWith('123456'));
    expect(await screen.findByText('aaaa-1111')).toBeInTheDocument();
  });

  test('shows a disable control when 2FA is already on', () => {
    useAuthStore.setState({ user: user({ twoFactorEnabled: true }) });
    wrap(<TwoFactorSettings />);
    expect(
      screen.getByRole('button', { name: /turn off two-factor/i })
    ).toBeInTheDocument();
  });
});

describe('LoginPage 2FA challenge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });

  test('reveals the code field after TWO_FACTOR_REQUIRED, then logs in with the code', async () => {
    mocked.login
      .mockRejectedValueOnce(new Error('TWO_FACTOR_REQUIRED'))
      .mockResolvedValueOnce({
        user: user({ twoFactorEnabled: true }),
        accessToken: 'tok',
      });

    const { container } = wrap(<LoginPage />);
    fireEvent.change(container.querySelector('#identifier') as HTMLInputElement, {
      target: { value: 'admin' },
    });
    fireEvent.change(container.querySelector('#password') as HTMLInputElement, {
      target: { value: 'Secret1!' },
    });
    fireEvent.click(container.querySelector('button[type="submit"]') as HTMLButtonElement);

    // The 2FA field appears on the next render.
    const totp = await screen.findByLabelText(/authentication code/i);
    fireEvent.change(totp, { target: { value: '654321' } });
    fireEvent.click(container.querySelector('button[type="submit"]') as HTMLButtonElement);

    await waitFor(() => expect(mocked.login).toHaveBeenCalledTimes(2));
    expect(mocked.login.mock.calls[1]?.[0]).toMatchObject({ totp: '654321' });
  });
});
