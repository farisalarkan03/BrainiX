import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Zap, AlertTriangle, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';

function ScanQR() {
    const navigate = useNavigate();
    const [manualCode, setManualCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleScan = (detectedCodes: any[]) => {
        if (detectedCodes && detectedCodes.length > 0) {
            const value = detectedCodes[0].rawValue;
            setResult(value);
            setScanned(true);
        }
    };

    const handleSummon = async () => {
        const codeToTest = result || manualCode;
        if (!codeToTest) return;

        setLoading(true);
        try {
            // Validate if it's a valid chapter code
            const chapter = await storage.getChapterByCode(codeToTest);

            if (!chapter) {
                alert('Invalid chapter code. Please scan a valid QR or enter a correct access key.');
                setScanned(false);
                setResult(null);
                return;
            }

            // Check access level
            const accessLevel = (chapter as any).accessLevel || 'public';

            if (accessLevel === 'draft') {
                alert('⚠️ Chapter ini belum tersedia!\n\nChapter masih dalam status draft dan belum dapat diakses. Silakan hubungi pengajar atau coba chapter lain.');
                setScanned(false);
                setResult(null);
                return;
            }

            // For public and private chapters, allow access
            navigate(`/briefing?code=${codeToTest}`);
        } catch (error) {
            console.error(error);
            alert("Error checking code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col p-4 relative overflow-hidden">
            {/* HUD overlay */}
            <div className="z-20 flex items-center justify-between mb-6">
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 w-5 h-5" /> Back
                </Button>
                <div className="text-cyan-400 font-display text-lg tracking-widest animate-pulse">
                    SCANNING MODE
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-md mx-auto">

                <AnimatePresence mode="wait">
                    {!scanned ? (
                        <>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.1, opacity: 0 }}
                                className="relative w-full aspect-square border-4 border-cyan-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.3)] mb-8"
                            >
                                <div className="absolute inset-0 z-0">
                                    <Scanner
                                        onScan={handleScan}
                                        allowMultiple={true}
                                        scanDelay={2000}
                                        styles={{
                                            container: { width: '100%', height: '100%' },
                                            video: { width: '100%', height: '100%', objectFit: 'cover' }
                                        }}
                                    />
                                </div>

                                {/* Scanner Line Animation */}
                                <motion.div
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_20px_#22d3ee] z-10"
                                />

                                {/* Corner Accents */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl z-20" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl z-20" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl z-20" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-xl z-20" />
                            </motion.div>

                            <div className="w-full">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="h-[1px] bg-slate-800 flex-1" />
                                    <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">OR ENTER CODE</span>
                                    <div className="h-[1px] bg-slate-800 flex-1" />
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="ACCESS KEY (e.g. ALG-X8Y2)"
                                        className="font-mono text-center uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"
                                        icon={<Key size={16} />}
                                        value={manualCode}
                                        onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && manualCode) {
                                                setResult(manualCode);
                                                setScanned(true);
                                                // We can trigger validation immediately roughly by setting scanned=true
                                                // which shows the confirmation card, then user clicks Summon
                                            }
                                        }}
                                    />
                                    <Button
                                        className="neon-shadow"
                                        onClick={() => {
                                            if (manualCode) {
                                                setResult(manualCode);
                                                setScanned(true);
                                            }
                                        }}
                                    >
                                        ENTER
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full"
                        >
                            <Card glow className="border-green-500/50">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400">
                                        <Zap size={32} />
                                    </div>
                                    <h2 className="text-2xl font-display font-bold text-white mb-2">TARGET LOCKED</h2>
                                    <p className="text-slate-400 mb-6 font-mono text-sm break-all">{result}</p>

                                    <div className="flex gap-4">
                                        <Button variant="secondary" onClick={() => { setScanned(false); setResult(null); }} className="flex-1" disabled={loading}>
                                            Rescan
                                        </Button>
                                        <Button onClick={handleSummon} className="flex-1 neon-shadow" disabled={loading}>
                                            {loading ? 'Checking...' : 'SUMMON BOSS'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!scanned && (
                    <p className="text-slate-500 mt-8 text-center max-w-xs text-sm">
                        <AlertTriangle className="inline w-4 h-4 mr-1 text-yellow-500" />
                        Point camera at the QR code on your LKS module. Ensure good lighting.
                    </p>
                )}
            </div>
        </div>
    );
}

export default ScanQR;
