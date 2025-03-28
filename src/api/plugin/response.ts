import { Elysia } from 'elysia';

function success(): { code: 0; msg: 'success' };
function success<T>(data: T): { code: 0; msg: 'success'; data: T };
function success<T>(data?: T) {
  return { code: 0, msg: 'success', data } as const;
}

function error<C extends number>(code: C): { code: C; msg: 'Unknown Error' };
function error<C extends number, M extends string>(code: C, msg: M): { code: C; msg: M };
function error<C extends number, M extends string, D>(
  code: C,
  msg: M,
  data: D
): { code: C; msg: M; data: D };
function error<C extends number, M extends string, D>(code: C, msg?: M, data?: D) {
  if (msg === undefined) return { code, msg: 'Unknown Error' } as const;
  return { code, msg, data } as const;
}

export const response = new Elysia({ name: 'Plugin.Response' })
  .decorate('suc', success)
  .decorate('err', error)
  // .onError(({ code, error }) => {
  //   if (code === 'VALIDATION') return error.validator.Errors(error.value).First().message;
  // })
  .as('scoped');
