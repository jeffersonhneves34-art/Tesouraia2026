
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: string;
  receiptUrl?: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}

export interface CashFlowSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  projectionNextYear: number;
}

export interface MonthlyData {
  month: string;
  current: number;
  projected: number;
}
