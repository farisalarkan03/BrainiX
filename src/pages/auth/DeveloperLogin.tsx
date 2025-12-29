import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Lock, Cpu, ArrowRight, X, Mail, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';

function DeveloperLogin() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // For signup only
    const [fullName, setFullName] = useState('Admin Dev');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await storage.login({ email, password });
            } else {
                await storage.signup({ email, password, fullName });
            }
            // Success
            navigate('/admin');
        } catch (error: any) {
            console.error("Auth Error:", error);
            alert("ACCESS DENIED: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Matrix-like Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            {/* Exit Button */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/')}
                className="absolute top-6 right-6 z-20 text-green-900 hover:text-green-500 transition-colors border border-green-900 hover:border-green-500 p-2 rounded-full bg-black/50"
                title="Terminate Session"
            >
                <X size={24} />
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <Card glow className="p-8 border-green-500/50 shadow-[0_0_30px_rgba(0,255,0,0.1)] bg-black/80 backdrop-blur">
                    <div className="text-center mb-6">
                        <Cpu className="w-12 h-12 text-green-500 mx-auto mb-4 animate-pulse" />
                        <h1 className="text-2xl font-mono font-bold text-green-500 mb-2">DEV CONSOLE</h1>
                        <p className="text-slate-500 font-mono text-xs">
                            {isLogin ? 'AUTHENTICATE USER' : 'REGISTER NEW ADMIN'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Admin Email"
                            icon={<Mail size={18} className="text-green-500" />}
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-green-900 focus-visible:ring-green-500 font-mono text-green-400 placeholder:text-green-900"
                        />

                        <Input
                            type="password"
                            placeholder="Password"
                            icon={<Lock size={18} className="text-green-500" />}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border-green-900 focus-visible:ring-green-500 font-mono text-green-400 placeholder:text-green-900"
                        />

                        {!isLogin && (
                            <Input
                                type="text"
                                placeholder="Display Name"
                                icon={<UserPlus size={18} className="text-green-500" />}
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="border-green-900 focus-visible:ring-green-500 font-mono text-green-400 placeholder:text-green-900"
                            />
                        )}

                        <Button className="w-full bg-green-900/20 hover:bg-green-900/40 text-green-500 border border-green-800" size="lg" disabled={loading}>
                            {loading ? (
                                <span className="animate-pulse">Processing...</span>
                            ) : (
                                <>
                                    {isLogin ? 'Initialize Session' : 'Create Access Key'}
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-xs font-mono text-green-700 hover:text-green-400 underline decoration-dashed"
                        >
                            {isLogin ? '[ SWITCH TO REGISTRATION MODE ]' : '[ BACK TO LOGIN ]'}
                        </button>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}

export default DeveloperLogin;
