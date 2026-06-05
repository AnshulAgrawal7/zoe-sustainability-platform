import { render, screen, fireEvent } from '@testing-library/react';
import { TestWrapper } from '../test-utils';
import NewsletterSignup from '../../components/ui/NewsletterSignup';

function setup() {
  render(
    <TestWrapper>
      <NewsletterSignup />
    </TestWrapper>
  );
}

test('always shows the prototype notice (no real send)', () => {
  setup();
  expect(screen.getByText(/no email is stored or sent/i)).toBeInTheDocument();
});

test('rejects an invalid email with an alert', () => {
  setup();
  fireEvent.change(screen.getByLabelText(/email address/i), {
    target: { value: 'not-an-email' },
  });
  fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));
  const alert = screen.getByRole('alert');
  expect(alert).toHaveTextContent(/valid email/i);
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

test('accepts a valid email and confirms success', () => {
  setup();
  fireEvent.change(screen.getByLabelText(/email address/i), {
    target: { value: 'visitor@example.com' },
  });
  fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));
  expect(screen.getByRole('status')).toHaveTextContent(/thanks/i);
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
