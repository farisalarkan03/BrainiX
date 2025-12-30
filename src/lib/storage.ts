import { db, auth, storage_bucket } from './firebase';
import {
    collection,
    getDocs,
    doc,
    setDoc,
    deleteDoc,
    query,
    where,
    getDoc
} from 'firebase/firestore';
import {
    ref,
    deleteObject
} from 'firebase/storage';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';

// Helper to generate unique chapter codes
export const generateChapterCode = (chapterName: string) => {
    const prefix = chapterName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${randomPart}`;
};

export const storage = {
    // --- CHAPTERS ---
    getChapters: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'chapters'));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting chapters:", error);
            return [];
        }
    },

    saveChapter: async (chapter: any) => {
        try {
            const newId = chapter.id || 'chapter_' + Date.now();
            const code = chapter.code || generateChapterCode(chapter.name);
            // Default accessLevel to 'public' for backward compatibility
            const accessLevel = chapter.accessLevel || 'public';
            const chapterData = { ...chapter, id: newId, code, accessLevel };

            await setDoc(doc(db, 'chapters', newId), chapterData);
            return chapterData;
        } catch (error) {
            console.error("Error saving chapter:", error);
            throw error;
        }
    },

    deleteChapter: async (id: string) => {
        try {
            await deleteDoc(doc(db, 'chapters', id));

            // Also delete questions for this chapter
            const questions = await storage.getQuestions(id);
            for (const q of questions) {
                await storage.deleteQuestion(q.id);
            }
        } catch (error) {
            console.error("Error deleting chapter:", error);
            throw error;
        }
    },

    getChapterByCode: async (code: string) => {
        try {
            const q = query(collection(db, 'chapters'), where("code", "==", code));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) return null;
            const d = querySnapshot.docs[0];
            return { id: d.id, ...d.data() };
        } catch (error) {
            console.error("Error getting chapter by code:", error);
            return null;
        }
    },

    getPublicChapters: async () => {
        try {
            const q = query(collection(db, 'chapters'), where("accessLevel", "==", "public"));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting public chapters:", error);
            return [];
        }
    },

    // --- QUESTIONS ---
    getQuestions: async (chapterId?: string) => {
        try {
            let q;
            if (chapterId) {
                q = query(collection(db, 'questions'), where("chapterId", "==", chapterId));
            } else {
                q = query(collection(db, 'questions'));
            }

            const querySnapshot = await getDocs(q);
            const questions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            return questions;
        } catch (error) {
            console.error("Error getting questions:", error);
            return [];
        }
    },

    saveQuestion: async (question: any) => {
        try {
            const newId = question.id || 'q_' + Date.now();
            const questionData = { ...question, id: newId };
            await setDoc(doc(db, 'questions', newId), questionData);
            return questionData;
        } catch (error) {
            console.error("Error saving question:", error);
            throw error;
        }
    },

    deleteQuestion: async (id: any) => {
        try {
            await deleteDoc(doc(db, 'questions', id));
        } catch (error) {
            console.error("Error deleting question:", error);
            throw error;
        }
    },

    // --- SCHOOLS ---
    getSchools: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'schools'));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting schools:", error);
            return [];
        }
    },

    saveSchool: async (school: any) => {
        try {
            const newId = school.id || 'school_' + Date.now();
            const schoolData = { ...school, id: newId };
            await setDoc(doc(db, 'schools', newId), schoolData);
            return schoolData;
        } catch (error) {
            console.error("Error saving school:", error);
            throw error;
        }
    },

    deleteSchool: async (id: string) => {
        try {
            await deleteDoc(doc(db, 'schools', id));
        } catch (error) {
            console.error("Error deleting school:", error);
            throw error;
        }
    },

    // --- AUTH ---
    signup: async (userData: any) => {
        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const user = userCredential.user;

            // 2. Update Profile (DisplayName)
            await updateProfile(user, {
                displayName: userData.fullName
            });

            // 3. Save extra data to Firestore 'users' collection
            const userDoc = {
                uid: user.uid,
                email: userData.email,
                fullName: userData.fullName,
                schoolId: userData.schoolId || '',
                schoolName: userData.schoolName || userData.school || '', // Fallback for backward compatibility
                createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', user.uid), userDoc);

            return userDoc;
        } catch (error: any) {
            console.error("Signup error:", error);
            throw error;
        }
    },

    login: async (credentials: any) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
            return userCredential.user;
        } catch (error: any) {
            console.error("Login error:", error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    },

    getCurrentUser: async () => { // Note: Ideally use onAuthStateChanged
        return auth.currentUser;
    },

    // Additional helper to get user profile from Firestore
    getUserProfile: async (uid: string) => {
        try {
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            }
            return null;
        } catch (error) {
            console.error("Error getting user profile:", error);
            return null;
        }
    },

    // Get all users (for admin dashboard)
    getAllUsers: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting all users:", error);
            return [];
        }
    },

    // --- CHEATSHEETS ---
    getCheatSheets: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'cheatsheets'));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting cheatsheets:", error);
            return [];
        }
    },

    getCheatSheetByChapter: async (chapterId: string) => {
        try {
            const q = query(collection(db, 'cheatsheets'), where("chapterId", "==", chapterId));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) return null;
            return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
        } catch (error) {
            console.error("Error getting cheatsheet by chapter:", error);
            return null;
        }
    },

    saveCheatSheet: async (cheatsheet: any) => {
        try {
            const newId = cheatsheet.id || 'cs_' + Date.now();
            const csData = { ...cheatsheet, id: newId, updatedAt: new Date().toISOString() };
            await setDoc(doc(db, 'cheatsheets', newId), csData);
            return csData;
        } catch (error) {
            console.error("Error saving cheatsheet:", error);
            throw error;
        }
    },

    deleteCheatSheet: async (id: string, imageUrl?: string) => {
        try {
            await deleteDoc(doc(db, 'cheatsheets', id));
            // Only attempt storage deletion if it's a real Firebase Storage URL (not Base64)
            if (imageUrl && imageUrl.startsWith('http') && imageUrl.includes('firebasestorage.googleapis.com')) {
                const imageRef = ref(storage_bucket, imageUrl);
                await deleteObject(imageRef).catch(e => console.warn("Failed to delete image file:", e));
            }
        } catch (error) {
            console.error("Error deleting cheatsheet:", error);
            throw error;
        }
    },

    uploadImage: async (file: File) => {
        try {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };
                reader.onerror = (error) => {
                    console.error("Base64 conversion error:", error);
                    reject(error);
                };
                reader.readAsDataURL(file);
            });
        } catch (error) {
            console.error("Error in uploadImage (Base64):", error);
            throw error;
        }
    }
};
