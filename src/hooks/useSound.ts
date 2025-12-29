import { useRef, useCallback } from 'react';

interface UseSoundReturn {
    playSound: (soundPath: string, volume?: number) => void;
    playBgMusic: (soundPath: string, volume?: number) => HTMLAudioElement | null;
    stopBgMusic: (audio: HTMLAudioElement | null) => void;
}

export const useSound = (): UseSoundReturn => {
    const playSound = useCallback((soundPath: string, volume: number = 0.5) => {
        try {
            const audio = new Audio(soundPath);
            audio.volume = Math.max(0, Math.min(1, volume));
            audio.play().catch(err => {
                console.log('Audio play failed:', err);
            });
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }, []);

    const playBgMusic = useCallback((soundPath: string, volume: number = 0.3): HTMLAudioElement | null => {
        try {
            const audio = new Audio(soundPath);
            audio.volume = Math.max(0, Math.min(1, volume));
            audio.loop = true;

            // Try to play, handle autoplay restrictions
            audio.play().catch(err => {
                console.log('Background music autoplay blocked. Will start on user interaction.', err);

                // Add click listener to start music on first user interaction
                const startMusic = () => {
                    audio.play().catch(e => console.log('Still failed:', e));
                    document.removeEventListener('click', startMusic);
                };
                document.addEventListener('click', startMusic, { once: true });
            });

            return audio;
        } catch (error) {
            console.error('Error playing background music:', error);
            return null;
        }
    }, []);

    const stopBgMusic = useCallback((audio: HTMLAudioElement | null) => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }, []);

    return { playSound, playBgMusic, stopBgMusic };
};
