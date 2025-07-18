import { Pagination } from '@calmpulse-app/types';

export type ExamplesQuery = {
  search?: string;
  orderBy?: 'newest' | 'oldest';
} & Pagination;
