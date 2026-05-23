import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Send, History, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export const Wallet: React.FC = () => {
  const { walletBalance, transactions, sendPayment } = useStore();
  const [isSending, setIsSending] = useState(false);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return toast.error('Enter valid amount');
    if (val > walletBalance) return toast.error('Insufficient funds');
    if (!recipient) return toast.error('Enter recipient username');

    setLoading(true);
    setTimeout(() => {
      sendPayment(val, recipient);
      setLoading(false);
      setIsSending(false);
      setAmount('');
      setRecipient('');
      toast.success(`₦${val} sent to ${recipient}!`);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-muted/30">
      <header className="p-6 bg-primary text-primary-foreground rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold">FemsWallet</h1>
            <ShieldCheck className="w-6 h-6 opacity-60" />
          </div>
          <div className="space-y-1">
            <p className="text-xs opacity-70 font-medium">Available Balance</p>
            <h2 className="text-5xl font-black italic tracking-tighter">₦{walletBalance.toLocaleString()}</h2>
          </div>
          <div className="flex gap-3 pt-4">
            <Button onClick={() => setIsSending(true)} className="flex-1 bg-white text-primary hover:bg-white/90 font-black italic">
              <Send className="w-4 h-4 mr-2" /> SEND
            </Button>
            <Button variant="outline" className="flex-1 border-white/40 text-white hover:bg-white/10 font-black italic">
              <CreditCard className="w-4 h-4 mr-2" /> TOP UP
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <AnimatePresence>
          {isSending && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Card className="p-4 border-2 border-primary space-y-4 shadow-xl">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm italic">Transfer Funds</h3>
                  <button onClick={() => setIsSending(false)} className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Close</button>
                </div>
                <div className="space-y-3">
                  <Input 
                    placeholder="@username" 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="font-bold"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-primary">₦</span>
                    <Input 
                      placeholder="0.00" 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8 font-black text-xl"
                    />
                  </div>
                  <Button onClick={handlePayment} className="w-full font-black italic py-6" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : 'CONFIRM HUSTLE PAYMENT'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-black italic text-sm text-primary uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4" /> Hustle History
            </h3>
            <button className="text-[10px] font-bold text-muted-foreground uppercase">View All</button>
          </div>
          
          <div className="space-y-3">
            {transactions.map(tx => (
              <div key={tx.id} className="bg-background p-4 rounded-2xl flex items-center justify-between border shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'IN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {tx.type === 'IN' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{tx.description}</h4>
                    <p className="text-[10px] text-muted-foreground">{new Date(tx.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black italic ${tx.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'IN' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                  </p>
                  <p className="text-[8px] uppercase font-black text-muted-foreground">Successful</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Card className="p-4 bg-primary/5 border-dashed border-2 border-primary/20 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <CreditCard className="w-4 h-4" />
            <h4 className="text-xs font-black uppercase">Virtual Account</h4>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground">Providus Bank</p>
              <p className="text-lg font-black italic tracking-widest">9901234567</p>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-[8px] font-black uppercase" onClick={() => toast.success('Account copied!')}>Copy</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};