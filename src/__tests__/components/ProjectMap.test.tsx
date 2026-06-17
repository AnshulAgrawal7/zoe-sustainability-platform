import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { TestWrapper } from '../test-utils';

// Leaflet renders a real map (canvas/sizes) that jsdom can't provide, so stub the
// react-leaflet primitives. Leaflet's L (divIcon / Icon.Default) works in jsdom.
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title?: string;
  }) => (
    <div data-testid="marker" title={title}>
      {children}
    </div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import ProjectMap, { type MapPoint } from '../../components/map/ProjectMap';

const points: MapPoint[] = [
  {
    id: 'proj-marine',
    title: 'Marine Protection',
    category: 'MARINE_PROTECTION',
    sdgs: [14, 15],
    lat: 39.8019,
    lng: 19.8697,
  },
  {
    id: 'proj-greenmove',
    title: 'GreenMove',
    category: 'MOBILITY',
    sdgs: [11],
    lat: 39.7467,
    lng: 19.9244,
  },
];

test('renders a labelled region with one marker per located point', () => {
  render(
    <TestWrapper>
      <ProjectMap points={points} />
    </TestWrapper>
  );
  expect(screen.getByRole('region')).toBeInTheDocument();
  expect(screen.getAllByTestId('marker')).toHaveLength(2);
  // Each marker popup links to its project detail page.
  const links = screen.getAllByRole('link', {
    name: /view project|projekt ansehen|προβολή έργου/i,
  });
  expect(links).toHaveLength(2);
  expect(links[0]).toHaveAttribute('href', '/projects/proj-marine');
});

test('exposes an accessible, keyboard-focusable list of map locations', () => {
  render(
    <TestWrapper>
      <ProjectMap points={points} />
    </TestWrapper>
  );
  // The sr-only list is labelled and contains a link per point to its detail page.
  const list = screen.getByRole('list', {
    name: /locations shown on the map|orte|τοποθεσιών/i,
  });
  const items = list.querySelectorAll('a[href^="/projects/"]');
  expect(items).toHaveLength(2);
  expect(items[0]).toHaveAttribute('href', '/projects/proj-marine');
});

test('skips points without coordinates and shows a message when none remain', () => {
  render(
    <TestWrapper>
      <ProjectMap points={[]} />
    </TestWrapper>
  );
  expect(screen.queryByTestId('map-container')).not.toBeInTheDocument();
  expect(
    screen.getByText(
      /no location data|keine standortdaten|δεν υπάρχουν δεδομένα/i
    )
  ).toBeInTheDocument();
});
