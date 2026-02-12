
import { Expense, Friend, Settlement } from './types';

export const calculateBalances = (friends: Friend[], expenses: Expense[], currentUserId: string): Record<string, number> => {
  const balances: Record<string, number> = {};
  
  // Initialize balances for all *current* friends
  friends.forEach(f => {
    if (f.id !== currentUserId) {
      balances[f.id] = 0;
    }
  });

  expenses.forEach(exp => {
    const share = exp.amount / exp.splitWith.length;
    
    // Case 1: The current user paid
    if (exp.paidBy === currentUserId) {
      exp.splitWith.forEach(friendId => {
        if (friendId !== currentUserId) {
          // Only track balance if the friend is still in the friends list
          if (balances[friendId] !== undefined) {
            balances[friendId] -= share; // Friend owes user (negative for friend)
          }
        }
      });
    } else {
      // Case 2: Someone else paid
      const friendPaidId = exp.paidBy;
      
      // If the current user is part of the split
      if (exp.splitWith.includes(currentUserId)) {
        // Only track balance if the friend who paid is still in the friends list
        if (balances[friendPaidId] !== undefined) {
          balances[friendPaidId] += share; // User owes friend (positive for friend)
        }
      }
    }
  });

  return balances;
};

export const simplifyDebts = (balances: Record<string, number>, friends: Friend[]): Settlement[] => {
  const settlements: Settlement[] = [];
  
  Object.entries(balances).forEach(([friendId, amount]) => {
    if (amount > 0) {
      settlements.push({ from: 'me', to: friendId, amount });
    } else if (amount < 0) {
      settlements.push({ from: friendId, to: 'me', amount: Math.abs(amount) });
    }
  });

  return settlements;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};
