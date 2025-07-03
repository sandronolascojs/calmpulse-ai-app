import { articleSchema } from '@calmpulse-app/types';
import {
  errorsSchema,
  ORDER_BY_OPTIONS,
  paginationMetaSchema,
  paginationSchema,
} from '@calmpulse-app/utils';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const contract = initContract();

export const slack = contract.router({
  
});
