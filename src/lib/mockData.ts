export interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number; // Index of the correct option
    damage: number; // Damage dealt to boss on correct answer
}

export const MOCK_QUESTIONS: Question[] = [
    {
        id: 1,
        text: "What is the powerhouse of the cell?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
        correctAnswer: 1,
        damage: 25
    },
    {
        id: 2,
        text: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        damage: 25
    },
    {
        id: 3,
        text: "What is the chemical symbol for Gold?",
        options: ["Au", "Ag", "Fe", "Cu"],
        correctAnswer: 0,
        damage: 25
    },
    {
        id: 4,
        text: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
        correctAnswer: 1,
        damage: 25
    }
];

export interface Student {
    id: string;
    name: string;
    schoolId: string;
    score: number;
    rank: number;
    avatar: string;
}

export interface School {
    id: string;
    name: string;
    totalScore: number;
    rank: number;
    logo: string;
}

export const MOCK_SCHOOLS: School[] = [
    { id: 's1', name: 'SMK Telkom Malang', totalScore: 15420, rank: 1, logo: 'T' },
    { id: 's2', name: 'SMA Negeri 1 Jakarta', totalScore: 14200, rank: 2, logo: 'S' },
    { id: 's3', name: 'SMA Pradita Dirgantara', totalScore: 13850, rank: 3, logo: 'P' },
    { id: 's4', name: 'MAN 2 Kota Malang', totalScore: 12100, rank: 4, logo: 'M' },
    { id: 's5', name: 'SMA Taruna Nusantara', totalScore: 11500, rank: 5, logo: 'N' },
];

export const MOCK_STUDENTS: Student[] = [
    { id: 'u1', name: 'Alex Thunder', schoolId: 's1', score: 2500, rank: 1, avatar: 'A' },
    { id: 'u2', name: 'Sarah Spark', schoolId: 's1', score: 2350, rank: 2, avatar: 'S' },
    { id: 'u3', name: 'Mike Voltage', schoolId: 's1', score: 2100, rank: 3, avatar: 'M' },
    { id: 'u4', name: 'Jessica Neon', schoolId: 's1', score: 1950, rank: 4, avatar: 'J' },
    { id: 'u5', name: 'David Pulse', schoolId: 's1', score: 1800, rank: 5, avatar: 'D' },
];
