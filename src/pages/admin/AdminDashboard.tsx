import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { storage, generateChapterCode } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, BookOpen, Users, BarChart3, Settings,
    Server, Swords, QrCode, Plus, Edit, Trash2, Save, X,
    ArrowLeft, Download, RefreshCw, Trophy, Medal, MapPin,
    Upload, Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';

// --- SUB-COMPONENTS ---

// 2. SCHOOLS MODULE (Partnership & Student Tracking)
function SchoolsModule() {
    const [schools, setSchools] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]); // To calculate stats
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [refresh, setRefresh] = useState(0);
    const [form, setForm] = useState({ name: '', region: '' });

    useEffect(() => {
        // Fetch Schools
        storage.getSchools().then(setSchools);
        // Fetch Users for stats (Note: In production, use aggregation queries)
        // We lack getAllUsers in storage, let's just stick to schools for now or improvise?
        // Ideally we need to count. I will assume we add getAllUsers or similar to storage.
        // For now, let's leave the count as 0/placeholder if storage.getAllUsers missing,
        // BUT I will add getAllUsers in the next step to make this work.
        if (storage.getAllUsers) {
            storage.getAllUsers().then(setUsers);
        }
    }, [refresh]);

    const handleSave = async () => {
        if (!form.name) return alert("School name required");
        try {
            const data = {
                id: (isEditing && isEditing !== 'new') ? isEditing : undefined,
                ...form
            };
            await storage.saveSchool(data);
            setIsEditing(null);
            setForm({ name: '', region: '' });
            setRefresh(p => p + 1);
        } catch (e: any) {
            alert("Error: " + e.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this school?")) {
            await storage.deleteSchool(id);
            setRefresh(p => p + 1);
        }
    };

    // Helper to calculate stats
    const getSchoolStats = (schoolId: string) => {
        if (!users.length) return { count: 0, performance: 0 };
        const students = users.filter(u => u.schoolId === schoolId);
        // Mock performance calculation (random for demo or based on some user field if it existed)
        // In real app, we'd average their 'xp' or 'score' from user profile
        return {
            count: students.length,
            performance: students.length > 0 ? Math.floor(Math.random() * 30) + 70 : 0 // Mock 70-100%
        };
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Registered Schools</h3>
                <Button onClick={() => { setIsEditing('new'); setForm({ name: '', region: '' }); }} className="neon-shadow">
                    <Plus className="w-4 h-4 mr-2" /> Add School
                </Button>
            </div>

            {isEditing && (
                <Card glow className="border-indigo-500/50 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-indigo-400">{isEditing === 'new' ? 'New School' : 'Edit School'}</h4>
                        <button onClick={() => setIsEditing(null)}><X size={20} className="text-slate-500" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input label="School Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. SMA Negeri 1 Jakarta" />
                        <Input label="Region / City" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} placeholder="e.g. Jakarta Pusat" />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSave}>Save Information</Button>
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-4">
                {schools.map(school => {
                    const stats = getSchoolStats(school.id);
                    return (
                        <Card key={school.id} className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex-1">
                                <h4 className="font-bold text-white text-lg">{school.name}</h4>
                                <p className="text-slate-500 text-sm flex items-center gap-2"><MapPin size={14} /> {school.region || 'No Region'}</p>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-cyan-400 font-display">{stats.count}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">Students</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-400 font-display">{stats.performance}%</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">Avg. Score</div>
                                </div>
                            </div>

                            <div className="flex gap-2 border-l border-slate-800 pl-4">
                                <Button size="sm" variant="secondary" onClick={() => { setIsEditing(school.id); setForm({ name: school.name, region: school.region }); }}>
                                    <Edit size={16} />
                                </Button>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(school.id)}>
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </Card>
                    );
                })}
                {schools.length === 0 && <p className="text-slate-500 text-center">No schools registered.</p>}
            </div>
        </div>
    );
}
// 1. CMS MODULE (Chapter-based Question Organization)
function CMSModule() {
    const [activeTab, setActiveTab] = useState<'questions' | 'cheatsheets' | 'qr'>('questions');
    const [chapters, setChapters] = useState<any[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<any | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [isEditingChapter, setIsEditingChapter] = useState<string | null>(null);
    const [isEditingQuestion, setIsEditingQuestion] = useState<string | null>(null);
    const [refresh, setRefresh] = useState(0);

    // Chapter Form State
    const [chapterForm, setChapterForm] = useState({
        name: '',
        description: '',
        difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
        accessLevel: 'public' as 'public' | 'private' | 'draft',
        code: ''
    });

    // Question Form State
    const [questionForm, setQuestionForm] = useState({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        damage: 25
    });

    // CheatSheet State
    const [cheatsheets, setCheatSheets] = useState<any[]>([]);
    const [isEditingCS, setIsEditingCS] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [csForm, setCsForm] = useState({
        chapterId: '',
        imageUrl: '',
        title: ''
    });


    useEffect(() => {
        storage.getChapters().then(setChapters);
        storage.getCheatSheets().then(setCheatSheets);
    }, [refresh]);

    useEffect(() => {
        if (selectedChapter) {
            storage.getQuestions(selectedChapter.id).then(setQuestions);
        }
    }, [selectedChapter, refresh]);

    const handleSaveChapter = async () => {
        try {
            const chapterData = {
                id: (isEditingChapter && isEditingChapter !== 'new') ? isEditingChapter : undefined,
                ...chapterForm
            };
            await storage.saveChapter(chapterData);
            setIsEditingChapter(null);
            setRefresh(p => p + 1);
            setChapterForm({ name: '', description: '', difficulty: 'Medium', accessLevel: 'public', code: '' });
        } catch (e: any) {
            alert("Error saving chapter: " + e.message);
        }
    };

    const handleDeleteChapter = async (id: string) => {
        if (confirm('Delete this chapter and all its questions?')) {
            await storage.deleteChapter(id);
            if (selectedChapter?.id === id) setSelectedChapter(null);
            setRefresh(p => p + 1);
        }
    };

    const handleSaveQuestion = async () => {
        if (!selectedChapter) {
            alert('Please select a chapter first');
            return;
        }
        try {
            const questionData = {
                id: (isEditingQuestion && isEditingQuestion !== 'new') ? isEditingQuestion : undefined,
                chapterId: selectedChapter.id,
                ...questionForm
            };
            await storage.saveQuestion(questionData);
            setIsEditingQuestion(null);
            setRefresh(p => p + 1);
            setQuestionForm({ text: '', options: ['', '', '', ''], correctAnswer: 0, damage: 25 });
        } catch (e: any) {
            alert("Error saving question: " + e.message);
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        if (confirm('Delete this question?')) {
            await storage.deleteQuestion(id);
            setRefresh(p => p + 1);
        }
    };

    const startEditChapter = (chapter: any) => {
        setIsEditingChapter(chapter.id);
        setChapterForm({
            name: chapter.name,
            description: chapter.description,
            difficulty: chapter.difficulty,
            accessLevel: chapter.accessLevel || 'public',
            code: chapter.code || ''
        });
    };

    const startEditQuestion = (question: any) => {
        setIsEditingQuestion(question.id);
        setQuestionForm({
            text: question.text,
            options: [...question.options],
            correctAnswer: question.correctAnswer,
            damage: question.damage
        });
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-400 bg-green-950/30';
            case 'Hard': return 'text-red-400 bg-red-950/30';
            default: return 'text-yellow-400 bg-yellow-950/30';
        }
    };

    const getAccessLevelInfo = (accessLevel: string) => {
        switch (accessLevel) {
            case 'public':
                return { label: '🌍 Public', color: 'text-green-400 bg-green-950/30 border-green-500/30', tooltip: 'Dapat diakses semua orang' };
            case 'private':
                return { label: '🔒 Private', color: 'text-orange-400 bg-orange-950/30 border-orange-500/30', tooltip: 'Hanya via QR/Code' };
            case 'draft':
                return { label: '📝 Draft', color: 'text-slate-400 bg-slate-900/50 border-slate-700', tooltip: 'Belum dapat diakses' };
            default:
                return { label: '🌍 Public', color: 'text-green-400 bg-green-950/30 border-green-500/30', tooltip: 'Dapat diakses semua orang' };
        }
    };

    const compressImage = (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onerror = (err) => {
                    console.error("Image loading error:", err);
                    resolve(file); // Fallback to original on error
                };
                img.onload = () => {
                    console.log("Image loaded for compression, dimensions:", img.width, "x", img.height);
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const newFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            console.log("Compression done. Original size:", (file.size / 1024).toFixed(2), "KB, New size:", (newFile.size / 1024).toFixed(2), "KB");
                            resolve(newFile);
                        } else {
                            console.warn("Canvas toBlob failed, using original file");
                            resolve(file);
                        }
                    }, 'image/jpeg', 0.8); // 80% quality
                };
            };
            reader.onerror = (err) => {
                console.error("FileReader error:", err);
                resolve(file);
            };
        });
    };

    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log("Starting upload process for:", file.name, "Type:", file.type);
        setIsUploading(true);
        try {
            // Compress image if it's an image
            let fileToUpload = file;
            if (file.type.startsWith('image/')) {
                console.log("Compressing image...");
                fileToUpload = await compressImage(file);
            }

            console.log("Converting to Base64...");
            const url = await storage.uploadImage(fileToUpload);
            console.log("Conversion success!");
            setCsForm({ ...csForm, imageUrl: url });
        } catch (error: any) {
            console.error("Upload error caught in UI:", error);
            alert("Upload failed: " + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveCS = async () => {
        if (!csForm.chapterId || !csForm.imageUrl) {
            return alert("Please select a chapter and upload an image");
        }
        try {
            const data = {
                id: (isEditingCS && isEditingCS !== 'new') ? isEditingCS : undefined,
                ...csForm
            };
            await storage.saveCheatSheet(data);
            setIsEditingCS(null);
            setCsForm({ chapterId: '', imageUrl: '', title: '' });
            setRefresh(p => p + 1);
        } catch (error: any) {
            alert("Error saving cheatsheet: " + error.message);
        }
    };

    const handleDeleteCS = async (id: string, imageUrl: string) => {
        if (confirm("Delete this cheatsheet?")) {
            try {
                await storage.deleteCheatSheet(id, imageUrl);
                setRefresh(p => p + 1);
            } catch (error: any) {
                alert("Error deleting: " + error.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Sub-Tabs */}
            <div className="flex gap-2 border-b border-slate-800 pb-2">
                <Button size="sm" variant={activeTab === 'questions' ? 'primary' : 'ghost'} onClick={() => setActiveTab('questions')}>
                    <Swords className="w-4 h-4 mr-2" /> Boss Challenges
                </Button>
                <Button size="sm" variant={activeTab === 'cheatsheets' ? 'primary' : 'ghost'} onClick={() => setActiveTab('cheatsheets')}>
                    <BookOpen className="w-4 h-4 mr-2" /> Cheat Sheets
                </Button>
                <Button size="sm" variant={activeTab === 'qr' ? 'primary' : 'ghost'} onClick={() => setActiveTab('qr')}>
                    <QrCode className="w-4 h-4 mr-2" /> QR Generator
                </Button>
            </div>

            {activeTab === 'questions' && (
                <div className="space-y-6">

                    {/* Breadcrumb / Back Navigation */}
                    {selectedChapter && (
                        <div className="flex items-center gap-2 text-slate-400">
                            <button onClick={() => setSelectedChapter(null)} className="hover:text-white flex items-center gap-1">
                                <ArrowLeft size={16} /> Chapters
                            </button>
                            <span>/</span>
                            <span className="text-white font-bold">{selectedChapter.name}</span>
                            <code className="ml-auto text-cyan-400 bg-slate-900 px-2 py-1 rounded text-xs">{selectedChapter.code}</code>
                        </div>
                    )}

                    {/* CHAPTER LIST VIEW */}
                    {!selectedChapter && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Chapters</h3>
                                <Button onClick={() => { setIsEditingChapter('new'); setChapterForm({ name: '', description: '', difficulty: 'Medium', accessLevel: 'public', code: '' }); }} className="neon-shadow">
                                    <Plus className="w-4 h-4 mr-2" /> Create Chapter
                                </Button>
                            </div>

                            {/* Chapter Editor */}
                            {isEditingChapter !== null && (
                                <Card glow className="border-purple-500/50 mb-6">
                                    <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                                        <h2 className="text-lg font-bold text-purple-400">
                                            {isEditingChapter === 'new' ? 'New Chapter' : 'Edit Chapter'}
                                        </h2>
                                        <button onClick={() => setIsEditingChapter(null)} className="text-slate-500 hover:text-white"><X size={20} /></button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input label="Chapter Name" value={chapterForm.name} onChange={e => setChapterForm({ ...chapterForm, name: e.target.value })} placeholder="e.g. Algebra Basics" />
                                            <div className="relative">
                                                <Input
                                                    label="Access Code (Auto-generated)"
                                                    value={chapterForm.code}
                                                    placeholder="Will be generated on save"
                                                    readOnly
                                                    className="bg-slate-900/50"
                                                />
                                                {chapterForm.name && (
                                                    <button
                                                        onClick={() => setChapterForm({ ...chapterForm, code: generateChapterCode(chapterForm.name) })}
                                                        className="absolute right-2 top-8 p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                                                        title="Regenerate Code"
                                                    >
                                                        <RefreshCw size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <Input label="Description" value={chapterForm.description} onChange={e => setChapterForm({ ...chapterForm, description: e.target.value })} placeholder="Short description for students" />
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Difficulty Level</label>
                                            <div className="flex gap-2">
                                                {['Easy', 'Medium', 'Hard'].map(level => (
                                                    <button
                                                        key={level}
                                                        onClick={() => setChapterForm({ ...chapterForm, difficulty: level as any })}
                                                        className={cn(
                                                            "px-4 py-2 rounded-lg font-bold text-sm transition-all",
                                                            chapterForm.difficulty === level
                                                                ? "bg-indigo-600 text-white"
                                                                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                                        )}
                                                    >
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Access Level</label>
                                            <div className="flex gap-2">
                                                {[
                                                    { value: 'public', label: '🌍 Public', tooltip: 'Dapat diakses semua orang' },
                                                    { value: 'private', label: '🔒 Private', tooltip: 'Hanya via QR/Code' },
                                                    { value: 'draft', label: '📝 Draft', tooltip: 'Belum dapat diakses' }
                                                ].map(level => (
                                                    <button
                                                        key={level.value}
                                                        onClick={() => setChapterForm({ ...chapterForm, accessLevel: level.value as any })}
                                                        title={level.tooltip}
                                                        className={cn(
                                                            "px-4 py-2 rounded-lg font-bold text-sm transition-all border",
                                                            chapterForm.accessLevel === level.value
                                                                ? level.value === 'public'
                                                                    ? "bg-green-600 text-white border-green-500"
                                                                    : level.value === 'private'
                                                                        ? "bg-orange-600 text-white border-orange-500"
                                                                        : "bg-slate-700 text-white border-slate-600"
                                                                : "bg-slate-800 text-slate-400 hover:bg-slate-700 border-slate-700"
                                                        )}
                                                    >
                                                        {level.label}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2">
                                                {chapterForm.accessLevel === 'public' && '✓ Chapter akan muncul di halaman utama'}
                                                {chapterForm.accessLevel === 'private' && '✓ Hanya dapat diakses menggunakan QR code atau kode akses'}
                                                {chapterForm.accessLevel === 'draft' && '✓ Chapter disimpan tapi belum dapat diakses'}
                                            </p>
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <Button onClick={handleSaveChapter}><Save className="w-4 h-4 mr-2" /> Save Chapter</Button>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* Chapter List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {chapters.map(chapter => {
                                    // Note: Counting questions synchronously is hard now. We'll skip or async load.
                                    // Simplified for now:
                                    const questionCount = "?";
                                    // const questionCount = storage.getQuestions(chapter.id).length;
                                    return (
                                        <Card key={chapter.id} className="p-6 hover:bg-slate-800/50 transition-colors group border-l-4 border-l-indigo-500 cursor-pointer" onClick={() => setSelectedChapter(chapter)}>
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{chapter.name}</h4>
                                                <div className="flex gap-2">
                                                    <span className={cn("text-xs font-bold px-2 py-1 rounded", getDifficultyColor(chapter.difficulty))}>
                                                        {chapter.difficulty}
                                                    </span>
                                                    <span
                                                        className={cn("text-xs font-bold px-2 py-1 rounded border", getAccessLevelInfo(chapter.accessLevel || 'public').color)}
                                                        title={getAccessLevelInfo(chapter.accessLevel || 'public').tooltip}
                                                    >
                                                        {getAccessLevelInfo(chapter.accessLevel || 'public').label}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-400 mb-4">{chapter.description || 'No description'}</p>
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-slate-500"><Swords size={12} className="inline mr-1" />{questionCount} Questions</span>
                                                    <code className="bg-slate-900 text-cyan-400 px-2 py-1 rounded font-mono">{chapter.code}</code>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                    <Button size="sm" variant="secondary" onClick={() => startEditChapter(chapter)}><Edit size={12} /></Button>
                                                    <Button size="sm" variant="danger" onClick={() => handleDeleteChapter(chapter.id)}><Trash2 size={12} /></Button>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                                {chapters.length === 0 && <p className="text-slate-500 text-center py-8 col-span-2">No chapters created yet.</p>}
                            </div>
                        </div>
                    )}

                    {/* QUESTION LIST VIEW (when chapter is selected) */}
                    {selectedChapter && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Questions in "{selectedChapter.name}"</h3>
                                <Button onClick={() => { setIsEditingQuestion('new'); setQuestionForm({ text: '', options: ['', '', '', ''], correctAnswer: 0, damage: 25 }); }} className="neon-shadow">
                                    <Plus className="w-4 h-4 mr-2" /> Add Question
                                </Button>
                            </div>

                            {/* Question Editor */}
                            {isEditingQuestion !== null && (
                                <Card glow className="border-cyan-500/50 mb-6">
                                    <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                                        <h2 className="text-lg font-bold text-cyan-400">
                                            {isEditingQuestion === 'new' ? 'New Question' : 'Edit Question'}
                                        </h2>
                                        <button onClick={() => setIsEditingQuestion(null)} className="text-slate-500 hover:text-white"><X size={20} /></button>
                                    </div>
                                    <div className="space-y-4">
                                        <Input label="Question Text" value={questionForm.text} onChange={e => setQuestionForm({ ...questionForm, text: e.target.value })} />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {questionForm.options.map((opt, idx) => (
                                                <div key={idx}>
                                                    <Input
                                                        label={`Option ${String.fromCharCode(65 + idx)}`}
                                                        value={opt}
                                                        onChange={e => {
                                                            const newOpts = [...questionForm.options];
                                                            newOpts[idx] = e.target.value;
                                                            setQuestionForm({ ...questionForm, options: newOpts });
                                                        }}
                                                        className={questionForm.correctAnswer === idx ? "border-green-500 ring-1 ring-green-500" : ""}
                                                    />
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <input
                                                            type="radio" name="correctAnswer"
                                                            checked={questionForm.correctAnswer === idx}
                                                            onChange={() => setQuestionForm({ ...questionForm, correctAnswer: idx })}
                                                            className="accent-green-500"
                                                        />
                                                        <span className="text-xs text-slate-400">Correct Answer</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <Button onClick={handleSaveQuestion}><Save className="w-4 h-4 mr-2" /> Save Question</Button>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {/* Question List */}
                            <div className="space-y-2">
                                {questions.map(q => (
                                    <div key={q.id} className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex justify-between items-center hover:bg-slate-800 transition-colors">
                                        <div>
                                            <p className="font-bold text-white line-clamp-1">{q.text}</p>
                                            <span className="text-xs text-indigo-400 font-mono">DMG: {q.damage}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="secondary" onClick={() => startEditQuestion(q)}><Edit size={14} /></Button>
                                            <Button size="sm" variant="danger" onClick={() => handleDeleteQuestion(q.id)}><Trash2 size={14} /></Button>
                                        </div>
                                    </div>
                                ))}
                                {questions.length === 0 && <p className="text-slate-500 text-center py-8">No questions in this chapter yet.</p>}
                            </div>
                        </div>
                    )}

                </div>
            )}

            {activeTab === 'cheatsheets' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">Cheat Sheet Management</h3>
                        <Button onClick={() => { setIsEditingCS('new'); setCsForm({ chapterId: '', imageUrl: '', title: '' }); }} className="neon-shadow">
                            <Plus className="w-4 h-4 mr-2" /> Add Cheat Sheet
                        </Button>
                    </div>

                    {isEditingCS && (
                        <Card glow className="border-cyan-500/50 mb-6">
                            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                                <h2 className="text-lg font-bold text-cyan-400">
                                    {isEditingCS === 'new' ? 'New Cheat Sheet' : 'Edit Cheat Sheet'}
                                </h2>
                                <button onClick={() => setIsEditingCS(null)} className="text-slate-500 hover:text-white"><X size={20} /></button>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Target Chapter</label>
                                        <select
                                            value={csForm.chapterId}
                                            onChange={e => setCsForm({ ...csForm, chapterId: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                        >
                                            <option value="">Select Chapter</option>
                                            {chapters.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <Input label="Short Title (Internal)" value={csForm.title} onChange={e => setCsForm({ ...csForm, title: e.target.value })} placeholder="e.g. Infografis Aljabar" />
                                </div>

                                <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 text-center bg-slate-950/50">
                                    {csForm.imageUrl ? (
                                        <div className="space-y-4">
                                            <img src={csForm.imageUrl} alt="Cheat Sheet" className="max-h-60 mx-auto rounded-lg shadow-lg" />
                                            <div className="flex justify-center gap-2">
                                                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => setCsForm({ ...csForm, imageUrl: '' })}>
                                                    <Trash2 size={14} className="mr-1" /> Remove Image
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-500">
                                                <ImageIcon size={32} />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold">Upload infographic/image</p>
                                                <p className="text-slate-500 text-sm">PNG, JPG or WebP supported</p>
                                            </div>
                                            <label className="inline-block cursor-pointer">
                                                <input type="file" className="hidden" accept="image/*" onChange={handleUploadImage} disabled={isUploading} />
                                                <Button variant="secondary" disabled={isUploading} className="pointer-events-none">
                                                    {isUploading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                                    {isUploading ? 'Processing...' : 'Choose Image'}
                                                </Button>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSaveCS} disabled={isUploading} className="neon-shadow">
                                        <Save className="w-4 h-4 mr-2" /> Save Cheat Sheet
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {cheatsheets.map(cs => {
                            const chapter = chapters.find(c => c.id === cs.chapterId);
                            return (
                                <Card key={cs.id} className="p-0 overflow-hidden group">
                                    <div className="h-40 bg-slate-950 flex items-center justify-center overflow-hidden">
                                        <img src={cs.imageUrl} alt={cs.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-4 bg-slate-900">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-white line-clamp-1">{cs.title || 'Untitled'}</h4>
                                            <Button size="sm" variant="danger" onClick={() => handleDeleteCS(cs.id, cs.imageUrl)}>
                                                <Trash2 size={12} />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <BookOpen size={12} />
                                            <span>Chapter: {chapter?.name || 'Unknown'}</span>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                        {cheatsheets.length === 0 && <p className="text-slate-500 text-center py-8 col-span-3">No cheat sheets found.</p>}
                    </div>
                </div>
            )}

            {activeTab === 'qr' && (
                <div className="space-y-4">
                    <p className="text-slate-400">QR codes for chapter access:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {chapters.map(chapter => (
                            <Card key={chapter.id} className="p-6 text-center flex flex-col items-center">
                                <div className="bg-white p-4 rounded-lg mb-4">
                                    <QRCodeCanvas
                                        id={`qr-${chapter.id}`}
                                        value={chapter.code}
                                        size={150}
                                        level={"H"}
                                        includeMargin={true}
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{chapter.name}</h3>
                                <code className="block bg-slate-950 p-2 rounded text-cyan-400 font-mono mb-4 text-lg tracking-widest">{chapter.code}</code>
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => {
                                        const canvas = document.getElementById(`qr-${chapter.id}`) as HTMLCanvasElement;
                                        if (canvas) {
                                            const pngUrl = canvas.toDataURL("image/png");
                                            const downloadLink = document.createElement("a");
                                            downloadLink.href = pngUrl;
                                            downloadLink.download = `BRAINIX-QR-${chapter.code}.png`;
                                            document.body.appendChild(downloadLink);
                                            downloadLink.click();
                                            document.body.removeChild(downloadLink);
                                        }
                                    }}
                                >
                                    <Download className="w-4 h-4 mr-2" /> Download PNG
                                </Button>
                            </Card>
                        ))}
                        {chapters.length === 0 && <p className="text-slate-500 col-span-3 text-center py-8">Create chapters first to generate QR codes.</p>}
                    </div>
                </div>
            )}
        </div>
    );
}


// 2. ANALYTICS MODULE
function AnalyticsModule() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 border-l-4 border-l-cyan-500">
                    <h4 className="text-slate-400 text-sm mb-1">Active Students</h4>
                    <div className="text-3xl font-bold text-white">1,240</div>
                    <div className="text-xs text-green-400 mt-1">+12% vs last week</div>
                </Card>
                <Card className="p-4 border-l-4 border-l-purple-500">
                    <h4 className="text-slate-400 text-sm mb-1">Activation Rate</h4>
                    <div className="text-3xl font-bold text-white">68%</div>
                    <div className="text-xs text-green-400 mt-1">Target KPI: 60% (Achieved)</div>
                </Card>
                <Card className="p-4 border-l-4 border-l-orange-500">
                    <h4 className="text-slate-400 text-sm mb-1">Revenue (SaaS)</h4>
                    <div className="text-3xl font-bold text-white">IDR 45M</div>
                    <div className="text-xs text-slate-500 mt-1">This Month</div>
                </Card>
            </div>

            <Card className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Mastery Heatmap (Top Failed Topics)</h3>
                <div className="space-y-4">
                    {[
                        { topic: 'Calculus: Derivatives', failRate: 78 },
                        { topic: 'Physics: Quantum Mechanics', failRate: 65 },
                        { topic: 'Chemistry: Stoichiometry', failRate: 52 },
                    ].map((item, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-300">{item.topic}</span>
                                <span className="text-red-400 font-bold">{item.failRate}% Fail Rate</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500" style={{ width: `${item.failRate}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

// 3. GAMIFICATION MODULE
function GamificationModule() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Settings className="w-5 h-5" /> XP Configuration</h3>
                <div className="space-y-4">
                    <Input label="XP per Correct Answer" defaultValue="50" />
                    <Input label="XP per Daily Login" defaultValue="20" />
                    <Input label="Streak Bonus Multiplier" defaultValue="1.5x" />
                    <Button className="w-full mt-4">Update Config</Button>
                </div>
            </Card>
            <Card className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Medal className="w-5 h-5" /> Achievement Creator</h3>
                <div className="space-y-4">
                    <Input label="Badge Name" placeholder="e.g. Speed Demon" />
                    <Input label="Condition (Logic)" placeholder="e.g. time < 30s" />
                    <Button variant="secondary" className="w-full mt-4">Create Badge</Button>
                </div>
            </Card>
        </div>
    );
}



// 5. SYSTEM HEALTH MODULE
function SystemModule() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 border-t-4 border-t-green-500 text-center">
                    <div className="text-2xl font-bold text-white text-green-400">99.9%</div>
                    <div className="text-xs text-slate-500">Uptime</div>
                </Card>
                <Card className="p-4 border-t-4 border-t-blue-500 text-center">
                    <div className="text-2xl font-bold text-white text-blue-400">45ms</div>
                    <div className="text-xs text-slate-500">Latency</div>
                </Card>
                <Card className="p-4 border-t-4 border-t-purple-500 text-center">
                    <div className="text-2xl font-bold text-white text-purple-400">Low</div>
                    <div className="text-xs text-slate-500">Server Load</div>
                </Card>
                <Card className="p-4 border-t-4 border-t-orange-500 text-center">
                    <div className="text-2xl font-bold text-white text-orange-400">1.2GB</div>
                    <div className="text-xs text-slate-500">Asset Cache</div>
                </Card>
            </div>

            <Card className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><RefreshCw className="w-5 h-5" /> Asset Optimizer</h3>
                <p className="text-slate-400 mb-4">Automatically compress uploaded images to save student data quota.</p>
                <div className="flex items-center justify-between bg-slate-900 p-4 rounded-lg">
                    <span className="text-slate-300">Auto-Compression</span>
                    <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                    </div>
                </div>
            </Card>
        </div>
    );
}


// --- MAIN LAYOUT COMPONENT ---

import { useAuthStore } from '@/store/authStore';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user, loading } = useAuthStore();
    const [activeModule, setActiveModule] = useState<'cms' | 'gamification' | 'schools' | 'analytics' | 'system'>('cms');

    if (loading) return null; // Or a loading spinner

    if (!user) {
        // Ideally check for specific admin role, but for now just auth
        setTimeout(() => navigate('/developer/login'), 0);
        return null;
    }

    return (
        <div className="min-h-screen bg-black flex font-sans">

            {/* SIDEBAR */}
            <aside className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-slate-900">
                    <h1 className="text-2xl font-black font-display text-white tracking-widest">BRAINIX <span className="text-cyan-500 text-xs block font-mono mt-1">DEV CONSOLE</span></h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {[
                        { id: 'cms', label: 'Content (CMS)', icon: <LayoutDashboard size={20} /> },
                        { id: 'gamification', label: 'Gamification', icon: <Trophy size={20} /> },
                        { id: 'schools', label: 'Partnerships', icon: <Users size={20} /> },
                        { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
                        { id: 'system', label: 'System Health', icon: <Server size={20} /> },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveModule(item.id as any)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm",
                                activeModule === item.id
                                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20"
                                    : "text-slate-500 hover:bg-slate-900 hover:text-white"
                            )}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-900">
                    <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30" onClick={() => navigate('/')}>
                        <LayoutDashboard className="w-4 h-4 mr-2" /> Exit Console
                    </Button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 ml-64 p-8 bg-black min-h-screen">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white capitalize">{activeModule.replace('cms', 'Content Management')}</h2>
                        <p className="text-slate-500">Manage your application ecosystem</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <div className="text-white font-bold">Admin User</div>
                            <div className="text-xs text-green-500">● Online</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                            <Settings size={20} className="text-slate-400" />
                        </div>
                    </div>
                </header>

                <motion.div
                    key={activeModule}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-6xl"
                >
                    {activeModule === 'cms' && <CMSModule />}
                    {activeModule === 'gamification' && <GamificationModule />}
                    {activeModule === 'schools' && <SchoolsModule />}
                    {activeModule === 'analytics' && <AnalyticsModule />}
                    {activeModule === 'system' && <SystemModule />}
                </motion.div>
            </main>

        </div>
    );
}
