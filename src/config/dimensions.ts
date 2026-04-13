// src/config/dimensions.ts
// Single source of truth for the 5 Peace Index dimensions.
// Every screen that shows dimension names or descriptions imports from here.
// Changing a label or description is a one-file change.

export type DimensionKey = 'purpose' | 'people' | 'place' | 'personalHealth' | 'provision';

export interface Dimension {
  key: DimensionKey;
  label: string;
  description: string;
}

export const DIMENSIONS: Dimension[] = [
  {
    key: 'purpose',
    label: 'Purpose',
    description:
      'How aligned are you with a clear sense of meaning and direction in your life? Consider whether your daily activities feel connected to something larger than yourself.',
  },
  {
    key: 'people',
    label: 'People',
    description:
      'How supported and connected do you feel in your key relationships? Consider the quality of your connections with family, friends, colleagues, and community.',
  },
  {
    key: 'place',
    label: 'Place',
    description:
      'How much does your physical environment contribute to your wellbeing? Consider your home, workplace, and the broader community or geography where you spend your time.',
  },
  {
    key: 'personalHealth',
    label: 'Personal Health',
    description:
      'How well are you maintaining your physical, mental, and emotional health? Consider your energy levels, sleep, exercise, and how you manage stress.',
  },
  {
    key: 'provision',
    label: 'Provision',
    description:
      'How secure and sufficient are your financial and material resources? Consider whether your current provision allows you to live without undue anxiety about basic needs.',
  },
];
