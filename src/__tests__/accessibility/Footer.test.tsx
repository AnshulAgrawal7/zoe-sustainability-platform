import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TestWrapper } from '../test-utils';
import Footer from '../../components/layout/Footer';

expect.extend(toHaveNoViolations);

test('Footer has no accessibility violations', async () => {
  const { container } = render(
    <TestWrapper>
      <Footer />
    </TestWrapper>,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
