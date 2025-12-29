import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Lock, User, ArrowRight, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';

function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await storage.login({ email, password });
            navigate('/dashboard');
        } catch (error: any) {
            console.error("Login error:", error);
            alert("Login Failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px]" />
            </div>

            {/* Exit Button */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/')}
                className="absolute top-6 right-6 z-20 text-slate-500 hover:text-red-500 transition-colors"
                title="Abort Login"
            >
                <X size={32} />
            </motion.button>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                <Card glow className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black font-display text-white mb-2">WELCOME BACK</h1>
                        <p className="text-slate-400">Enter your credentials to continue your quest.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <Input
                                placeholder="Email Address"
                                type="email"
                                icon={<User size={18} />}
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                icon={<Lock size={18} />}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <Button className="w-full neon-shadow" size="lg" disabled={loading}>
                            {loading ? (
                                <span className="animate-pulse">Accessing Mainframe...</span>
                            ) : (
                                <>Enter Portal <ArrowRight className="ml-2 w-4 h-4" /></>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        New challenger? <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Join the Guild</Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}

export default Login;
