import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi, describe, test, expect } from 'vitest';
import { TestWrapper } from '../test-utils';
import LoadError from '../../components/ui/LoadError';

expect.extend(toHaveNoViolations);

describe('LoadError', () => {
  test('renders an alert with the default message', () => {
    render(
      <TestWrapper>
        <LoadError />
      </TestWrapper>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/could not load data/i)).toBeInTheDocument();
  });

  test('calls onRetry when the retry button is clicked', () => {
    const onRetry = vi.fn();
    render(
      <TestWrapper>
        <LoadError onRetry={onRetry} />
      </TestWrapper>
    );
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  test('hides the retry button when no handler is given', () => {
    render(
      <TestWrapper>
        <LoadError />
      </TestWrapper>
    );
    expect(screen.queryByRole('button')).toBeNull();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <TestWrapper>
        <LoadError onRetry={() => {}} />
      </TestWrapper>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
