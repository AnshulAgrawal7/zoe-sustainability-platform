import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { TestWrapper } from '../test-utils';
import ProfilePage from '../../pages/user/ProfilePage';
import * as userService from '../../services/userService';

vi.mock('../../services/userService', () => ({
  updateMe: vi.fn(),
  downloadMyData: vi.fn(() => Promise.resolve()),
  deleteMyAccount: vi.fn(() => Promise.resolve()),
}));
vi.mock('../../services/authService', () => ({
  logout: vi.fn(() => Promise.resolve()),
}));

const mockedDownload = vi.mocked(userService.downloadMyData);
const mockedDelete = vi.mocked(userService.deleteMyAccount);

describe('ProfilePage GDPR self-service', () => {
  beforeEach(() => {
    mockedDownload.mockClear();
    mockedDelete.mockClear();
  });

  test('triggers a data export download', async () => {
    render(
      <TestWrapper>
        <ProfilePage />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText(/download my data/i));
    await waitFor(() => expect(mockedDownload).toHaveBeenCalledTimes(1));
  });

  test('account deletion requires explicit acknowledgement', async () => {
    render(
      <TestWrapper>
        <ProfilePage />
      </TestWrapper>
    );
    // Reveal the confirm panel.
    fireEvent.click(screen.getByText('Delete my account'));

    const finalBtn = screen.getByText('Permanently delete');
    expect(finalBtn).toBeDisabled();
    // Clicking while disabled must not call the service.
    fireEvent.click(finalBtn);
    expect(mockedDelete).not.toHaveBeenCalled();

    // Acknowledge → enabled → deletes.
    fireEvent.click(screen.getByRole('checkbox'));
    expect(finalBtn).toBeEnabled();
    fireEvent.click(finalBtn);
    await waitFor(() => expect(mockedDelete).toHaveBeenCalledTimes(1));
  });
});
