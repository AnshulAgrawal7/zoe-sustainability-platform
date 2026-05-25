import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TestWrapper } from '../test-utils';
import LoginPage from '../../pages/auth/LoginPage';

expect.extend(toHaveNoViolations);

test('LoginPage has no accessibility violations', async () => {
  const { container } = render(
    <TestWrapper>
      <LoginPage />
    </TestWrapper>,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
