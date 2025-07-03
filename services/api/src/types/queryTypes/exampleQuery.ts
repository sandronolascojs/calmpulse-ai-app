import { Pagination } from '@calmpulse-app/utils';

export interface ExamplesQuery extends Pagination {
  search?: string;
  orderBy?: 'newest' | 'oldest';
}
