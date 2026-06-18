import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../utils/i18n';
import VerifyEmailPage from '../../pages/auth/VerifyEmailPage';
import EmailVerificationBanner from '../../components/auth/EmailVerificationBanner';
import * as authService from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import type { AuthUser } from '../../types';

vi.mock('../../services/authService', () => ({
  verifyEmail: vi.fn(),
  resendVerification: vi.fn(),
}));

const mockedVerify = vi.mocked(authService.verifyEmail);
const mockedResend = vi.mocked(authService.resendVerification);

function renderAt(node: React.ReactNode, path = '/') {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[path]}>{node}</MemoryRouter>
    </I18nextProvider>
  );
}

const baseUser = (over: Partial<AuthUser>): AuthUser =>
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

describe('VerifyEmailPage', () => {
  beforeEach(() => mockedVerify.mockReset());

  test('verifies the token from the URL and shows success', async () => {
    mockedVerify.mockResolvedValue();
    renderAt(<VerifyEmailPage />, '/verify-email?token=tok');
    await waitFor(() => expect(mockedVerify).toHaveBeenCalledWith('tok'));
    expect(await screen.findByRole('status')).toBeInTheDocument();
  });

  test('shows an error without a token', () => {
    renderAt(<VerifyEmailPage />, '/verify-email');
    expect(mockedVerify).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

describe('EmailVerificationBanner', () => {
  beforeEach(() => mockedResend.mockReset());

  test('renders nothing for a verified user', () => {
    useAuthStore.setState({ user: baseUser({ emailVerified: true }) });
    const { container } = renderAt(<EmailVerificationBanner />);
    expect(container).toBeEmptyDOMElement();
  });

  test('shows for an unverified user and resends on click', async () => {
    mockedResend.mockResolvedValue();
    useAuthStore.setState({ user: baseUser({ emailVerified: false }) });
    renderAt(<EmailVerificationBanner />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(mockedResend).toHaveBeenCalledTimes(1));
  });
});
