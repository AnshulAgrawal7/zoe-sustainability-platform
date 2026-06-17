import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TestWrapper } from '../test-utils';
import NotFoundPage from '../../pages/NotFoundPage';

expect.extend(toHaveNoViolations);

test('NotFoundPage renders translated content with a single h1', () => {
  render(
    <TestWrapper>
      <NotFoundPage />
    </TestWrapper>
  );
  expect(screen.getByText('404')).toBeInTheDocument();
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  // Link back home is present and points at the root.
  expect(screen.getByRole('link')).toHaveAttribute('href', '/');
});

test('NotFoundPage has no accessibility violations', async () => {
  const { container } = render(
    <TestWrapper>
      <NotFoundPage />
    </TestWrapper>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
