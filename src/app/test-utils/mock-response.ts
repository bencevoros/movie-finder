import { throwError } from 'rxjs';

export const getErrorResponse = () => throwError(() => {
  const error: any = new Error('Not found');
  error.response = { status: 400 };
  return error;
});
