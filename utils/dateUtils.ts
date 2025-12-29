
import { addMonths, format, parseISO, differenceInDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const calculateExpiration = (startDate: string, months: number): string => {
  const date = parseISO(startDate);
  const expiration = addMonths(date, months);
  return format(expiration, 'yyyy-MM-dd');
};

export const formatDateBR = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy');
  } catch {
    return dateStr;
  }
};

export const getStatus = (expirationDate: string) => {
  const today = startOfDay(new Date());
  const expiration = startOfDay(parseISO(expirationDate));
  const daysDiff = differenceInDays(expiration, today);

  if (daysDiff < 0) return 'EXPIRED';
  if (daysDiff <= 3) return 'EXPIRING_SOON';
  return 'ACTIVE';
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
