import type { MapMarker } from '../types'

export const initialMarkers: MapMarker[] = [
  {
    id: 'loc-1',
    title: 'Amoga Headquarters',
    description: 'Global engineering and research campus',
    latitude: 37.7749,
    longitude: -122.4194,
    category: 'Office',
    address: '500 Howard Street, San Francisco, CA 94105',
  },
  {
    id: 'loc-2',
    title: 'Cloud Data Center Alpha',
    description: 'Tier-4 hyperscale compute cluster',
    latitude: 37.3382,
    longitude: -121.8863,
    category: 'Infrastructure',
    address: '100 Innovation Way, San Jose, CA 95110',
  },
  {
    id: 'loc-3',
    title: 'Design Systems Innovation Hub',
    description: 'Human-computer interaction research lab',
    latitude: 37.4419,
    longitude: -122.143,
    category: 'Research',
    address: '250 University Ave, Palo Alto, CA 94301',
  },
  {
    id: 'loc-4',
    title: 'North America Distribution Hub',
    description: 'Automated fulfillment and routing operations',
    latitude: 37.8044,
    longitude: -122.2712,
    category: 'Logistics',
    address: '1200 Broadway, Oakland, CA 94612',
  },
]
