
import React, { useState } from 'react';
import { Friend } from '../types';
import { formatCurrency } from '../utils';

interface FriendsListProps {
  friends: Friend[];
  balances: Record<string, number>;
  onAddFriend: (name: string) => void;
  onDeleteFriend: (id: string) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ friends, balances, onAddFriend, onDeleteFriend }) => {
  const [newFriendName, setNewFriendName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFriendName.trim()) {
      onAddFriend(newFriendName.trim());
      setNewFriendName('');
    }
  };

  const otherFriends = friends.filter(f => f.id !== 'user-0');

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold mb-4 text-slate-800">Add New Friend</h3>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input 
            type="text"
            required
            placeholder="Enter full name..."
            className="flex-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition-all placeholder:text-slate-400"
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
          >
            Add Friend
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {otherFriends.map(friend => {
          const balance = balances[friend.id] || 0;
          return (
            <div key={friend.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:border-teal-200 hover:shadow-md transition-all group relative overflow-hidden">
              <div className="flex items-center gap-4 z-10">
                <div className="relative">
                  <img src={friend.avatar} className="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover" alt={friend.name} />
                  <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${balance === 0 ? 'bg-slate-300' : balance > 0 ? 'bg-rose-500' : 'bg-teal-500'}`}></div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg group-hover:text-teal-700 transition-colors">{friend.name}</h4>
                  <p className="text-xs text-slate-400">
                    {balance === 0 ? 'Settled up' : 'Activity in progress'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 z-10">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 tracking-wider">
                    {balance > 0 ? 'You owe' : balance < 0 ? 'Owes you' : 'Settled'}
                  </p>
                  <p className={`text-base font-bold ${balance > 0 ? 'text-rose-500' : balance < 0 ? 'text-teal-600' : 'text-slate-300'}`}>
                    {balance === 0 ? '₹0.00' : formatCurrency(Math.abs(balance))}
                  </p>
                </div>

                <button 
                  onClick={() => onDeleteFriend(friend.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title="Delete Friend"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>

              {/* Decorative accent */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${balance === 0 ? 'bg-slate-100' : balance > 0 ? 'bg-rose-100 group-hover:bg-rose-400' : 'bg-teal-100 group-hover:bg-teal-400'}`}></div>
            </div>
          );
        })}

        {otherFriends.length === 0 && (
          <div className="md:col-span-2 text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
            </div>
            <h4 className="text-slate-800 font-bold text-lg">No Friends Added</h4>
            <p className="text-slate-400 mt-1">Start by adding your roommates or travel buddies!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
