
import { CelestialObject } from './types';

export const SOLAR_SYSTEM_DATA: CelestialObject[] = [
  {
    id: 'sun',
    name: 'The Sun',
    type: 'star',
    description: 'A nearly perfect sphere of hot plasma at the center of our solar system.',
    image: 'https://images.unsplash.com/photo-1614326422337-4242946c596d?auto=format&fit=crop&q=80&w=2560',
    distance: '0 km',
    details: ['Age: 4.6 Billion Years', 'Surface Temp: 5,500°C', 'Type: Yellow Dwarf']
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'planet',
    description: 'The smallest and innermost planet, with a surface scarred by billions of years of impacts.',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=2560',
    distance: '58 Million km',
    details: ['Day length: 176 Earth Days', 'Gravity: 0.38 of Earth', 'Moons: 0']
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'planet',
    description: 'Earth\'s "evil twin" with a runaway greenhouse effect and surface temperatures hot enough to melt lead.',
    image: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?auto=format&fit=crop&q=80&w=2560',
    distance: '108 Million km',
    details: ['Temp: 462°C', 'Pressure: 92x Earth', 'Rotation: Retrograde']
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'planet',
    description: 'Our sanctuary in the void, the only known world to harbor liquid water and life.',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=2560',
    distance: '150 Million km',
    details: ['Tilt: 23.5 Degrees', 'Atmosphere: N2, O2', 'Moons: 1']
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'planet',
    description: 'The Red Planet, home to the largest volcano in the solar system, Olympus Mons.',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=2560',
    distance: '225 Million km',
    details: ['Day length: 24.6 Hours', 'Gravity: 0.375 of Earth', 'Moons: 2']
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    description: 'The gas giant king with the iconic Great Red Spot, a storm larger than Earth itself.',
    image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?auto=format&fit=crop&q=80&w=2560',
    distance: '778 Million km',
    details: ['Mass: 318 Earths', 'Moons: 95', 'Fastest Rotation: 10 Hours']
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'planet',
    description: 'Adorned with a dazzling, complex system of icy rings that stretch thousands of kilometers.',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=2560',
    distance: '1.4 Billion km',
    details: ['Rings: 7 Main Groups', 'Moons: 146', 'Density: Less than Water']
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'planet',
    description: 'The tilted ice giant that rotates on its side, appearing as a featureless cyan sphere.',
    image: 'https://images.unsplash.com/photo-1614732484003-ef9881555dc3?auto=format&fit=crop&q=80&w=2560',
    distance: '2.9 Billion km',
    details: ['Tilt: 98 Degrees', 'Type: Ice Giant', 'Moons: 27']
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'planet',
    description: 'The most distant planet, a dark, cold world whipped by supersonic winds.',
    image: 'https://images.unsplash.com/photo-1614314107768-6018061b5b72?auto=format&fit=crop&q=80&w=2560',
    distance: '4.5 Billion km',
    details: ['Year length: 165 Earth Years', 'Winds: 2,100 km/h', 'Moons: 14']
  }
];

export const GALAXY_DATA: CelestialObject[] = [
  {
    id: 'milky-way',
    name: 'Milky Way',
    type: 'galaxy',
    description: 'Our cosmic home, a barred spiral galaxy containing 100-400 billion stars.',
    image: 'https://images.unsplash.com/photo-1516331138075-f3ad16d49f24?auto=format&fit=crop&q=80&w=2560',
    distance: '0 ly',
    details: ['Diameter: 100,000 ly', 'Center: Sagittarius A*', 'Type: Barred Spiral']
  },
  {
    id: 'andromeda',
    name: 'Andromeda',
    type: 'galaxy',
    description: 'The nearest major galaxy to the Milky Way, destined to collide with us in 4 billion years.',
    image: 'https://images.unsplash.com/photo-1543722530-d2c32013a1e6?auto=format&fit=crop&q=80&w=2560',
    distance: '2.5 Million ly',
    details: ['Diameter: 220,000 ly', 'Stars: 1 Trillion', 'Movement: 110 km/s towards us']
  }
];
