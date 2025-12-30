import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import Landing from '@/pages/Landing';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import DeveloperLogin from '@/pages/auth/DeveloperLogin';
import Dashboard from '@/pages/Dashboard';
import ScanQR from '@/pages/ScanQR';
import BattleArena from '@/pages/BattleArena';
import Briefing from '@/pages/Briefing';
import Leaderboard from '@/pages/Leaderboard';
import AdminDashboard from '@/pages/admin/AdminDashboard';

function App() {
    const { setUser, setLoading } = useAuthStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [setUser, setLoading]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/scan" element={<ScanQR />} />
                <Route path="/briefing" element={<Briefing />} />
                <Route path="/battle" element={<BattleArena />} />
                <Route path="/leaderboard" element={<Leaderboard />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/developer/login" element={<DeveloperLogin />} />

                {/* Player Dashboard - Main Hub */}
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
