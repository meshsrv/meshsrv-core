import type { TNumber, TObject, TOptional, TString } from '@sinclair/typebox';
import { t, type TSchema } from 'elysia';

export type Nullable<T> = T | null | undefined;

export function respt(): TObject<{ code: TNumber; msg: TString }>;
export function respt<T extends TSchema>(
  data?: T
): TObject<{ code: TNumber; msg: TString; data: TOptional<T> }>;
export function respt<T extends TSchema>(data?: T) {
  return t.Object({
    code: t.Number({ default: 0 }),
    msg: t.String({ default: 'success' }),
    ...(data && { data: t.Optional(data) }),
  });
}
