import limax from 'limax';

export const generateSlug = (name: string): string => {
  return limax(name, {
    lang: 'en',
    separator: '-',
    separateNumbers: true,
    separateApostrophes: true,
  });
};
