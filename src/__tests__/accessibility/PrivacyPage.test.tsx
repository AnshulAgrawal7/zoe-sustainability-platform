import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TestWrapper } from '../test-utils';
import PrivacyPage from '../../pages/PrivacyPage';

expect.extend(toHaveNoViolations);

test('PrivacyPage has no accessibility violations', async () => {
  const { container } = render(
    <TestWrapper>
      <PrivacyPage />
    </TestWrapper>,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
