import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TestWrapper } from '../test-utils';
import GetInvolvedPage from '../../pages/GetInvolvedPage';

expect.extend(toHaveNoViolations);

test('GetInvolvedPage has no accessibility violations', async () => {
  const { container } = render(
    <TestWrapper>
      <GetInvolvedPage />
    </TestWrapper>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
