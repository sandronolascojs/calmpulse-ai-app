import z from 'zod';

const errorsSchema = z.object({
  401: z.object({
    message: z.string(),
  }),
  403: z.object({
    message: z.string(),
  }),
  404: z.object({
    message: z.string(),
  }),
  405: z.object({
    message: z.string(),
  }),
  409: z.object({
    message: z.string(),
  }),
  429: z.object({
    message: z.string(),
  }),
  500: z.object({
    message: z.string(),
  }),
});

export { errorsSchema };
