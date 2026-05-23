import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Smartphone, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const Auth: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useStore(state => state.login);

  const handleSendOtp = () => {
    if (phone.length < 10) return toast.error('Enter valid phone number');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      toast.success('OTP sent via SMS (Mock)');
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 4) return toast.error('Enter valid OTP');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('profile');
    }, 1000);
  };

  const handleComplete = () => {
    if (!username) return toast.error('Choose a hustle name!');
    login(phone, username);
    toast.success(`Welcome to FemsChat, ${username}!`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-primary/10 to-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-primary italic">FemsChat</h1>
          <p className="text-muted-foreground font-medium italic">Chat, Create, Stream, Hustle.</p>
        </div>

        <Card className="p-6 shadow-xl border-2">
          {step === 'phone' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 border rounded-md bg-muted text-sm font-bold">+234</div>
                  <Input 
                    placeholder="801 234 5678" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                  />
                </div>
              </div>
              <Button onClick={handleSendOtp} className="w-full font-bold h-12" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Get Started'}
              </Button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Enter 4-Digit OTP
                </label>
                <Input 
                  placeholder="0000" 
                  maxLength={4} 
                  className="text-center text-2xl tracking-widest"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <p className="text-xs text-center text-muted-foreground">OTP expires in 2:00</p>
              </div>
              <Button onClick={handleVerifyOtp} className="w-full font-bold h-12" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : 'Verify OTP'}
              </Button>
            </div>
          )}

          {step === 'profile' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold flex items-center gap-2">
                  <UserIcon className="w-4 h-4" /> Choose Username
                </label>
                <Input 
                  placeholder="hustler_vibes" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <Button onClick={handleComplete} className="w-full font-bold h-12">
                Finish Setup
              </Button>
            </div>
          )}
        </Card>

        <p className="text-xs text-center text-muted-foreground px-4">
          By continuing, you agree to our Hustle Terms & Conditions. Data charges may apply.
        </p>
      </div>
    </div>
  );
};