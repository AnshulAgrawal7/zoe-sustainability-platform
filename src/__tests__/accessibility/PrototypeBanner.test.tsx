import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TestWrapper } from '../test-utils';
import PrototypeBanner from '../../components/ui/PrototypeBanner';

expect.extend(toHaveNoViolations);

test('PrototypeBanner has no accessibility violations', async () => {
  const { container } = render(
    <TestWrapper>
      <PrototypeBanner />
    </TestWrapper>,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
