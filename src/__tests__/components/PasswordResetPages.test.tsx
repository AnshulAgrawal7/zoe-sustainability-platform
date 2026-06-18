import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { axe, toHaveNoViolations } from 'jest-axe';
import i18n from '../../utils/i18n';
import ForgotPasswordPage from '../../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../../pages/auth/ResetPasswordPage';
import * as authService from '../../services/authService';

expect.extend(toHaveNoViolations);

vi.mock('../../services/authService', () => ({
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
}));

const mockedRequest = vi.mocked(authService.requestPasswordReset);
const mockedReset = vi.mocked(authService.resetPassword);

function renderAt(node: React.ReactNode, path = '/') {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[path]}>{node}</MemoryRouter>
    </I18nextProvider>
  );
}

describe('ForgotPasswordPage', () => {
  beforeEach(() => mockedRequest.mockReset());

  test('has no accessibility violations', async () => {
    const { container } = renderAt(<ForgotPasswordPage />);
    expect(await axe(container)).toHaveNoViolations();
  });

  test('submits the address and shows a generic confirmation', async () => {
    mockedRequest.mockResolvedValue();
    const { container } = renderAt(<ForgotPasswordPage />);
    fireEvent.change(
      container.querySelector('#forgot-email') as HTMLInputElement,
      {
        target: { value: 'me@example.com' },
      }
    );
    fireEvent.click(
      container.querySelector('button[type="submit"]') as HTMLButtonElement
    );
    await waitFor(() =>
      expect(mockedRequest).toHaveBeenCalledWith('me@example.com')
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

describe('ResetPasswordPage', () => {
  beforeEach(() => mockedReset.mockReset());

  test('shows a "no token" notice when the link lacks a token', () => {
    renderAt(<ResetPasswordPage />, '/reset-password');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByLabelText(/new password/i)).not.toBeInTheDocument();
  });

  test('submits the new password with the token from the URL', async () => {
    mockedReset.mockResolvedValue();
    const { container } = renderAt(
      <ResetPasswordPage />,
      '/reset-password?token=abc123'
    );
    fireEvent.change(
      container.querySelector('#reset-password') as HTMLInputElement,
      {
        target: { value: 'BrandNew9!' },
      }
    );
    fireEvent.change(
      container.querySelector('#reset-confirm') as HTMLInputElement,
      {
        target: { value: 'BrandNew9!' },
      }
    );
    fireEvent.click(
      container.querySelector('button[type="submit"]') as HTMLButtonElement
    );
    await waitFor(() =>
      expect(mockedReset).toHaveBeenCalledWith('abc123', 'BrandNew9!')
    );
  });
});
