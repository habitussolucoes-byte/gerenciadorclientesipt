
export interface Client {
  id: string;
  name: string;
  whatsapp: string;
  value: number;
  durationMonths: number;
  startDate: string;
  expirationDate: string;
}

export enum SubscriptionStatus {
  ACTIVE = 'Ativo',
  EXPIRING_SOON = 'Vencendo logo',
  EXPIRED = 'Vencido'
}

export interface DashboardStats {
  activeCount: number;
  expiringCount: number;
  revenueForecast: number;
}
