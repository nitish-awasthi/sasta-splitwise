
import React, { useState } from 'react';
import { Friend, Expense, ExpenseCategory } from '../types.ts';
import { parseExpenseWithAI } from '../services/geminiService.ts';

interface ExpenseFormProps {
  onClose: () => void;
  onSubmit: (expense: Expense) => void;
  friends: Friend[];
  meId: string;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onClose, onSubmit, friends, meId }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(meId);
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.FOOD);
  const [selectedFriends, setSelectedFriends] = useState<string[]>(friends.map(f => f.id));
  const [aiInput, setAiInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleAiParse = async () => {
    if (!aiInput.trim()) return;
    setIsParsing(true);
    const result = await parseExpenseWithAI(aiInput);
    if (result) {
      setDescription(result.description);
      setAmount(result.amount.toString());
      if (Object.values(ExpenseCategory).includes(result.category as ExpenseCategory)) {
        setCategory(result.category as ExpenseCategory);
      }
      
      if (result.mentionedNames && result.mentionedNames.length > 0) {
        const matchedIds = friends
          .filter(f => result.mentionedNames.some((name: string) => f.name.toLowerCase().includes(name.toLowerCase())))
          .map(f => f.id);
        
        if (matchedIds.length > 0) {
          setSelectedFriends([...new Set([meId, ...matchedIds])]);
        }
      }
    }
    setIsParsing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || selectedFriends.length === 0) return;

    onSubmit({
      id: `e-${Date.now()}`,
      description,
      amount: parseFloat(amount),
      paidBy,
      splitWith: selectedFriends,
      date: new Date().toISOString(),
      category
    });
  };

  const toggleFriendSelection = (id: string) => {
    setSelectedFriends(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-center bg-teal-600 text-white">
          <h3 className="text-xl font-bold">Add Expense</h3>
          <button onClick={onClose} className="hover:bg-teal-700 p-2 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
            <label className="block text-sm font-semibold text-teal-800 mb-2">Smart Entry (AI)</label>
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="e.g. Paid 500 for Pizza with Rahul"
                className="flex-1 p-2 rounded-lg border border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiParse()}
              />
              <button 
                onClick={handleAiParse}
                disabled={isParsing || !aiInput}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 flex items-center gap-2 transition-all hover:bg-teal-700"
              >
                {isParsing ? '...' : 'Parse'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                <input 
                  type="text"
                  required
                  placeholder="Dinner, Gas, etc."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Amount (₹)</label>
                <input 
                  type="number"
                  required
                  placeholder="0.00"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Paid By</label>
                <select 
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-teal-500"
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                >
                  {friends.map(f => (
                    <option key={f.id} value={f.id}>{f.id === meId ? 'You' : f.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                <select 
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-teal-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                >
                  {Object.values(ExpenseCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase">Split With</label>
                <button 
                  type="button"
                  onClick={() => setSelectedFriends(friends.map(f => f.id))}
                  className="text-[10px] text-teal-600 font-bold hover:underline"
                >
                  SELECT ALL
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                {friends.map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFriendSelection(f.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                      selectedFriends.includes(f.id) 
                        ? 'border-teal-500 bg-teal-50 text-teal-700' 
                        : 'border-slate-100 bg-slate-50 text-slate-500 grayscale'
                    }`}
                  >
                    <img src={f.avatar} className="w-6 h-6 rounded-full" />
                    <span className="text-sm font-medium truncate">{f.id === meId ? 'You' : f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-teal-600/30 hover:bg-teal-700 transition-all active:scale-[0.98] mt-4"
            >
              Add Expense
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
