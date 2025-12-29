import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Link, useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { Lock, User, Mail, School, ArrowRight, X } from 'lucide-react';

function Signup() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [schools, setSchools] = useState<any[]>([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [selectedSchoolId, setSelectedSchoolId] = useState('');

    // Fetch schools on mount
    useEffect(() => {
        storage.getSchools().then(data => setSchools(data));
    }, []);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const selectedSchool = schools.find(s => s.id === selectedSchoolId);
            const schoolName = selectedSchool ? selectedSchool.name : '';

            await storage.signup({
                email,
                password,
                fullName,
                schoolId: selectedSchoolId,
                schoolName: schoolName
            });
            navigate('/dashboard');
        } catch (error: any) {
            console.error("Signup error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Exit Button */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/')}
                className="absolute top-6 right-6 z-20 text-slate-500 hover:text-red-500 transition-colors"
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
                        <h1 className="text-3xl font-black font-display text-white mb-2">NEW PLAYER</h1>
                        <p className="text-slate-400">Register to start your adventure.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <Input
                            placeholder="Full Name"
                            icon={<User size={18} />}
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                        <Input
                            placeholder="Email Address"
                            type="email"
                            icon={<Mail size={18} />}
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className="relative">
                            <School size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <select
                                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                                value={selectedSchoolId}
                                onChange={(e) => setSelectedSchoolId(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select your School</option>
                                {schools.map(school => (
                                    <option key={school.id} value={school.id}>{school.name} - {school.region}</option>
                                ))}
                                <option value="other">Other / Not Listed</option>
                            </select>
                        </div>

                        <Input
                            type="password"
                            placeholder="Choose Password"
                            icon={<Lock size={18} />}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button className="w-full neon-shadow mt-4" size="lg" disabled={loading}>
                            {loading ? (
                                <span className="animate-pulse">Creating Profile...</span>
                            ) : (
                                <>Start Game <ArrowRight className="ml-2 w-4 h-4" /></>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Login</Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}

export default Signup;
