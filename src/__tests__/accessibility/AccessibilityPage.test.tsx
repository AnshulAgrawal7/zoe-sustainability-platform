import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TestWrapper } from '../test-utils';
import AccessibilityPage from '../../pages/AccessibilityPage';

expect.extend(toHaveNoViolations);

test('AccessibilityPage has no accessibility violations', async () => {
  const { container } = render(
    <TestWrapper>
      <AccessibilityPage />
    </TestWrapper>,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
