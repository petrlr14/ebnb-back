import { ValidationOptions } from 'class-validator';
import { format } from 'date-fns';

export function ISOToDBDate(isoDate: string) {
  return format(new Date(isoDate), 'yyyy-MM-dd kk:mm:ss.SSS');
}

export const timeFormatPattern: [x1: RegExp, x2: ValidationOptions] = [
  /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
  {
    message: 'Invalid format for time. Format required HH:MM',
  },
];
