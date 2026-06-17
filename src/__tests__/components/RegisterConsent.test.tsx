import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { TestWrapper } from '../test-utils';
import RegisterPage from '../../pages/auth/RegisterPage';
import * as authService from '../../services/authService';

vi.mock('../../services/authService', () => ({
  register: vi.fn(),
}));

const mockedRegister = vi.mocked(authService.register);

function fillValidForm(container: HTMLElement) {
  const byId = (id: string) =>
    container.querySelector<HTMLInputElement>(`#${id}`) as HTMLInputElement;
  fireEvent.change(byId('name'), { target: { value: 'Jane Tester' } });
  fireEvent.change(byId('reg-username'), { target: { value: 'janetester' } });
  fireEvent.change(byId('reg-email'), {
    target: { value: 'jane@example.com' },
  });
  fireEvent.change(byId('reg-password'), { target: { value: 'TestPass1!' } });
  fireEvent.change(byId('reg-confirm-password'), {
    target: { value: 'TestPass1!' },
  });
}

describe('RegisterPage consent gate', () => {
  beforeEach(() => {
    mockedRegister.mockReset();
  });

  test('renders a privacy-policy consent checkbox and link', () => {
    const { container } = render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    );
    expect(
      container.querySelector('input[type="checkbox"]')
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /privacy/i })).toHaveAttribute(
      'href',
      '/privacy'
    );
  });

  test('blocks submission and shows an error when consent is unchecked', async () => {
    const { container } = render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    );
    fillValidForm(container);
    fireEvent.click(
      container.querySelector('button[type="submit"]') as HTMLButtonElement
    );

    await waitFor(() =>
      expect(screen.getByText(/consent/i)).toBeInTheDocument()
    );
    expect(mockedRegister).not.toHaveBeenCalled();
  });

  test('submits with consent=true once the box is checked', async () => {
    mockedRegister.mockResolvedValue({
      user: { id: 'u1' },
      accessToken: 't',
    } as unknown as Awaited<ReturnType<typeof authService.register>>);

    const { container } = render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    );
    fillValidForm(container);
    fireEvent.click(
      container.querySelector('input[type="checkbox"]') as HTMLInputElement
    );
    fireEvent.click(
      container.querySelector('button[type="submit"]') as HTMLButtonElement
    );

    await waitFor(() => expect(mockedRegister).toHaveBeenCalledTimes(1));
    expect(mockedRegister.mock.calls[0]?.[0]).toMatchObject({ consent: true });
  });
});
