'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError('The keys provided do not match our records.');
      } else {
        window.location.href = '/admin/dashboard';
      }
    } catch (err) {
      setError('A connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#003527]">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#003527] via-[#003527]/80 to-transparent" />
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px]" 
        />
      </div>

      <div className="relative z-10 w-full max-w-lg px-6 py-12">
        {/* Logo Medallion */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="relative h-32 w-32 bg-white rounded-full p-6 shadow-[0_0_50px_rgba(255,255,255,0.1)] border border-white/10 mb-6 group cursor-default">
            <Image
              src="/4SEASONSLOGO.png"
              alt="4 Seasons Logo"
              fill
              className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
              priority
            />
          </div>
          <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.6em]">Administrative Suite</span>
          <h1 className="text-3xl font-display text-white mt-2 tracking-tight">The Curator&apos;s Entry</h1>
        </motion.div>

        {/* Floating Monolith Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-premium border-white/5 shadow-2xl overflow-hidden rounded-[2.5rem]"
        >
          <div className="p-10 md:p-12">
            <div className="mb-10 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Access Control</h2>
                <p className="text-xs text-white/50 font-serif italic">Provide your credentials to manage the hub.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert className="bg-destructive/20 border-destructive/30 text-destructive-foreground rounded-2xl py-3 px-4">
                      <AlertDescription className="text-xs font-bold tracking-wide flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                        {error}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2 group">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 transition-colors group-focus-within:text-primary">
                  Intelligence Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={cn(
                      "h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-white/20 px-5 focus:ring-primary/20 transition-all duration-300",
                      errors.email && "border-destructive/50 bg-destructive/5"
                    )}
                    placeholder="curator@4seasons.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] font-bold text-destructive/80 ml-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 transition-colors group-focus-within:text-primary">
                  Master Key
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className={cn(
                      "h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-white/20 px-5 focus:ring-primary/20 transition-all duration-300",
                      errors.password && "border-destructive/50 bg-destructive/5"
                    )}
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] font-bold text-destructive/80 ml-1">{errors.password.message}</p>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 rounded-2xl gradient-gold text-white font-bold tracking-widest uppercase text-xs shadow-xl shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
                >
                  {isLoading ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 size={20} />
                    </motion.div>
                  ) : (
                    <span className="flex items-center gap-2">
                       Authenticate Access <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="bg-white/5 border-t border-white/5 p-6 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
              Four Seasons Hub Cryptography Layer v2.0
            </p>
          </div>
        </motion.div>

        {/* Footer Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <button 
            onClick={() => window.location.href = '/'}
            className="text-white/30 hover:text-primary text-[10px] font-black uppercase tracking-widest transition-all duration-300"
          >
            Return to Public Gallery
          </button>
        </motion.div>
      </div>
    </div>
  );
}
