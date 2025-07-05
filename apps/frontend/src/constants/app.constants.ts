import { APP_CONFIG } from '@calmpulse-app/types';

export const APP = {
  name: APP_CONFIG.basics.name,
  description: APP_CONFIG.basics.description,
  theme: {
    localStorageKey: 'calmpulse-theme',
    defaultTheme: 'system',
  },
};
