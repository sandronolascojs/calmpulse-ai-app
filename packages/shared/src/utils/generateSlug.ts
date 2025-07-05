import slugify from 'slugify';

export const generateSlug = (name: string) => {
  return slugify(name, { lower: true, strict: true, trim: true, locale: 'en' });
};
