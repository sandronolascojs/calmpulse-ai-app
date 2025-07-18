import { z } from 'zod';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_PAGINATION_QUERY = {
  page: DEFAULT_PAGE,
  limit: DEFAULT_PAGE_SIZE,
};

export type DefaultSearchParams = typeof DEFAULT_PAGINATION_QUERY;

export const ORDER_BY_OPTIONS = ['newest', 'oldest'] as const;
export type OrderBy = (typeof ORDER_BY_OPTIONS)[number];

export const paginationMetaSchema = z.object({
  totalItems: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  itemsPerPage: z.number(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().default(DEFAULT_PAGE),
  limit: z.coerce.number().default(DEFAULT_PAGE_SIZE),
});

export type Pagination = z.infer<typeof paginationSchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
