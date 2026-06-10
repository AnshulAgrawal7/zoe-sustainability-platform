import { render, screen, fireEvent, within } from '@testing-library/react';
import { TestWrapper } from '../test-utils';
import InitiativeTabs from '../../components/engagement/InitiativeTabs';
import { projects } from '../../data/projects';

function setup() {
  render(
    <TestWrapper>
      <InitiativeTabs projects={projects} />
    </TestWrapper>
  );
}

test('renders one tab per non-empty initiative within a tablist', () => {
  setup();
  const tablist = screen.getByRole('tablist', { name: /zoe initiatives/i });
  const tabs = within(tablist).getAllByRole('tab');
  // The 5 canonical categories map onto 3 non-empty thematic initiatives.
  expect(tabs).toHaveLength(3);
  expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
});

test('shows only the selected initiative panel and switches on click', () => {
  setup();
  const tabs = screen.getAllByRole('tab');
  // The single visible tabpanel is the active one.
  expect(screen.getAllByRole('tabpanel')).toHaveLength(1);

  fireEvent.click(tabs[1]);
  expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
  const panel = screen.getByRole('tabpanel');
  expect(panel).toHaveAttribute('aria-labelledby', tabs[1].getAttribute('id'));
});

test('supports arrow-key navigation between tabs', () => {
  setup();
  const tabs = screen.getAllByRole('tab');
  fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
  expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  fireEvent.keyDown(tabs[1], { key: 'Home' });
  expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
});
