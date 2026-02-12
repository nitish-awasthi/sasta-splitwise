
export interface Friend {
  id: string;
  name: string;
  avatar: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // Friend ID
  splitWith: string[]; // Array of Friend IDs
  date: string;
  category: ExpenseCategory;
}

export enum ExpenseCategory {
  FOOD = 'Food',
  TRAVEL = 'Travel',
  RENT = 'Rent',
  ENTERTAINMENT = 'Entertainment',
  SHOPPING = 'Shopping',
  OTHERS = 'Others'
}

export interface Settlement {
  from: string; // Friend ID
  to: string; // Friend ID
  amount: number;
}

export interface UserBalance {
  friendId: string;
  netBalance: number; // Positive means user owes this friend, negative means friend owes user
}
