import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Gamepad2, QrCode, Trophy, Zap, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';

import { useAuthStore } from '@/store/authStore';

function Landing() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isHovered, setIsHovered] = useState(false);

  // Redirect to Dashboard if already logged in?
  // User asked to fix "why suddenly dashboard", so maybe we should REMOVE this auto-redirect
  // or at least make it work correctly.
  // If we remove it, the user sees the landing page even if logged in, which is often better.
  // Let's keep the logic but correct it, so they have a choice.
  // Actually, the user complaint implies they DON'T want to be forced to dashboard.
  // So I will remove the auto-redirect block entirely.


  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-4xl w-full"
      >
        <motion.h1
          className="text-6xl md:text-8xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 mb-6 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{ scale: isHovered ? 1.05 : 1 }}
        >
          BRAINIX
        </motion.h1>

        <p className="text-xl text-slate-400 mb-12 font-light tracking-wide">
          FINAL BOSS CHALLENGE
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card glow className="bg-slate-900/40 hover:bg-slate-900/60 transition-colors group cursor-pointer border-l-4 border-l-cyan-400" onClick={() => navigate('/scan')}>
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <QrCode size={32} />
              </div>
              <h3 className="text-2xl font-bold font-display text-white">Scan QR</h3>
            </div>
            <p className="text-slate-400 text-left">
              Found a challenge in your LKS? Scan the code to summon the boss.
            </p>
          </Card>

          <Card glow className="bg-slate-900/40 hover:bg-slate-900/60 transition-colors group cursor-pointer border-l-4 border-l-purple-500" onClick={() => navigate('/leaderboard')}>
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                <Trophy size={32} />
              </div>
              <h3 className="text-2xl font-bold font-display text-white">Leaderboard</h3>
            </div>
            <p className="text-slate-400 text-left">
              Check your school's ranking and complete globally.
            </p>
          </Card>
        </div>

        <div className="flex flex-col gap-6 justify-center items-center">
          {user ? (
            <Card className="p-6 border-indigo-500/30 bg-indigo-950/20 w-full max-w-lg">
              <div className="flex flex-col items-center gap-4">
                <div className="text-center">
                  <h3 className="text-lg text-indigo-300 font-bold mb-1">PLAYER READY</h3>
                  <div className="text-2xl text-white font-black animate-pulse">
                    {user.displayName || user.email}
                  </div>
                </div>
                <div className="flex gap-4 w-full">
                  <Button size="lg" className="flex-1 neon-shadow" onClick={() => navigate('/scan')}>
                    <Zap className="w-5 h-5 mr-2" /> RESUME GAME
                  </Button>
                  <Button variant="danger" size="lg" onClick={() => {
                    storage.logout();
                    window.location.reload();
                  }}>
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="flex flex-col md:flex-row gap-4">
              <Button size="lg" className="w-full md:w-auto neon-shadow" onClick={() => navigate('/login')}>
                <Zap className="w-5 h-5 mr-2" /> Start Journey
              </Button>
              <Button variant="secondary" size="lg" className="w-full md:w-auto" onClick={() => navigate('/developer/login')}>
                <Gamepad2 className="w-5 h-5 mr-2" /> Developer Login
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Landing;
