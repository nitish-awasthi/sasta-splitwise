
import React, { useState, useEffect, useMemo } from 'react';
import { Friend, Expense, ExpenseCategory } from './types';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import FriendsList from './components/FriendsList';
import ExpenseList from './components/ExpenseList';
import { calculateBalances } from './utils';

const ME_ID = 'user-0';

const INITIAL_FRIENDS: Friend[] = [
  { id: ME_ID, name: 'You', avatar: 'https://picsum.photos/seed/me/100/100' },
  { id: 'f-1', name: 'Rahul Sharma', avatar: 'https://picsum.photos/seed/rahul/100/100' },
  { id: 'f-2', name: 'Priya Singh', avatar: 'https://picsum.photos/seed/priya/100/100' },
  { id: 'f-3', name: 'Aniket Gupta', avatar: 'https://picsum.photos/seed/aniket/100/100' },
];

const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'e-1',
    description: 'Dinner at Social',
    amount: 2400,
    paidBy: ME_ID,
    splitWith: [ME_ID, 'f-1', 'f-2'],
    date: new Date().toISOString(),
    category: ExpenseCategory.FOOD
  }
];

const App: React.FC = () => {
  // Load initial data from localStorage or use defaults
  const [friends, setFriends] = useState<Friend[]>(() => {
    const saved = localStorage.getItem('rupeeSplit_friends');
    return saved ? JSON.parse(saved) : INITIAL_FRIENDS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('rupeeSplit_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses' | 'friends'>('dashboard');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('rupeeSplit_friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem('rupeeSplit_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const balances = useMemo(() => calculateBalances(friends, expenses, ME_ID), [friends, expenses]);

  const totalOwe = (Object.values(balances) as number[]).filter(b => b > 0).reduce((sum, b) => sum + b, 0);
  const totalOwed = Math.abs((Object.values(balances) as number[]).filter(b => b < 0).reduce((sum, b) => sum + b, 0));

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses(prev => [newExpense, ...prev]);
    setIsAddingExpense(false);
  };

  const handleAddFriend = (name: string) => {
    const newFriend: Friend = {
      id: `f-${Date.now()}`,
      name,
      avatar: `https://picsum.photos/seed/${encodeURIComponent(name)}/100/100`
    };
    setFriends(prev => [...prev, newFriend]);
  };

  const handleDeleteFriend = (id: string) => {
    // We check if there are pending balances before deletion
    const balance = balances[id] || 0;
    if (Math.abs(balance) > 0.1) {
      if (!window.confirm(`This friend has a pending balance of ₹${Math.abs(balance).toFixed(2)}. Are you sure you want to delete them?`)) {
        return;
      }
    }
    setFriends(prev => prev.filter(f => f.id !== id));
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <aside className="fixed bottom-0 left-0 w-full bg-white border-t z-50 md:relative md:w-64 md:h-screen md:border-r md:border-t-0 md:bg-white flex flex-col">
        <div className="hidden md:flex items-center p-6 gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            ₹
          </div>
          <h1 className="text-xl font-bold text-slate-800">RupeeSplit</h1>
        </div>
        
        <nav className="flex md:flex-col justify-around md:justify-start md:mt-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-4 md:px-6 md:py-3 text-sm md:text-base transition-colors ${activeTab === 'dashboard' ? 'text-teal-600 font-semibold bg-teal-50/50' : 'text-slate-600 hover:text-teal-600'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('expenses')}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-4 md:px-6 md:py-3 text-sm md:text-base transition-colors ${activeTab === 'expenses' ? 'text-teal-600 font-semibold bg-teal-50/50' : 'text-slate-600 hover:text-teal-600'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
            <span>Expenses</span>
          </button>
          <button 
            onClick={() => setActiveTab('friends')}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-4 md:px-6 md:py-3 text-sm md:text-base transition-colors ${activeTab === 'friends' ? 'text-teal-600 font-semibold bg-teal-50/50' : 'text-slate-600 hover:text-teal-600'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            <span>Friends</span>
          </button>
        </nav>

        <div className="hidden md:block mt-auto p-6">
          <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl">
            <img src={friends.find(f => f.id === ME_ID)?.avatar || INITIAL_FRIENDS[0].avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">You</p>
              <p className="text-xs text-slate-500">Free Account</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 md:h-screen md:overflow-y-auto pb-24 md:pb-0 px-4 md:px-8 py-6 max-w-5xl mx-auto w-full">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 capitalize">{activeTab}</h2>
            <p className="text-slate-500 text-sm mt-1">Manage your shared finances easily.</p>
          </div>
          <button 
            onClick={() => setIsAddingExpense(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 md:px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-teal-600/20 transition-all flex items-center gap-2"
          >
            <span className="text-lg">+</span> Add Expense
          </button>
        </header>

        <div className="space-y-6">
          {activeTab === 'dashboard' && (
            <Dashboard 
              totalOwe={totalOwe} 
              totalOwed={totalOwed} 
              balances={balances} 
              friends={friends} 
              expenses={expenses}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpenseList 
              expenses={expenses} 
              friends={friends} 
              onDelete={handleDeleteExpense} 
            />
          )}

          {activeTab === 'friends' && (
            <FriendsList 
              friends={friends} 
              balances={balances} 
              onAddFriend={handleAddFriend}
              onDeleteFriend={handleDeleteFriend}
            />
          )}
        </div>
      </main>

      {isAddingExpense && (
        <ExpenseForm 
          onClose={() => setIsAddingExpense(false)} 
          onSubmit={handleAddExpense} 
          friends={friends}
          meId={ME_ID}
        />
      )}
    </div>
  );
};

export default App;
