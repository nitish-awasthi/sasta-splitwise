
import React from 'react';
import { Friend, Expense } from '../types';
import { formatCurrency } from '../utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardProps {
  totalOwe: number;
  totalOwed: number;
  balances: Record<string, number>;
  friends: Friend[];
  expenses: Expense[];
}

const COLORS = ['#0d9488', '#f43f5e', '#f59e0b', '#3b82f6', '#8b5cf6'];

const Dashboard: React.FC<DashboardProps> = ({ totalOwe, totalOwed, balances, friends, expenses }) => {
  const netBalance = totalOwed - totalOwe;

  const categoryData = React.useMemo(() => {
    const data: Record<string, number> = {};
    expenses.forEach(e => {
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Top Cards */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Total Balance</p>
        <p className={`text-3xl font-bold ${netBalance >= 0 ? 'text-teal-600' : 'text-rose-500'}`}>
          {netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
        </p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">You Owe</p>
        <p className="text-3xl font-bold text-rose-500">{formatCurrency(totalOwe)}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">You are Owed</p>
        <p className="text-3xl font-bold text-teal-600">{formatCurrency(totalOwed)}</p>
      </div>

      {/* Main Stats */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Spending by Category</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs text-slate-600 font-medium">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Stats */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold mb-4 text-slate-800">Recent Activity</h3>
        <div className="space-y-4">
          {expenses.slice(0, 5).map(exp => (
            <div key={exp.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">{exp.description}</p>
                <p className="text-xs text-slate-500">{new Date(exp.date).toLocaleDateString()}</p>
              </div>
              <p className="text-sm font-bold">{formatCurrency(exp.amount)}</p>
            </div>
          ))}
          {expenses.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No expenses yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
