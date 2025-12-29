# BRAINIX Sound Assets

## Required Audio Files

Place the following audio files in the `public/sounds/` directory:

### 1. correct.mp3
**Purpose**: Sound effect when player answers correctly  
**Recommended sources**:
- [Mixkit Success Notification](https://mixkit.co/free-sound-effects/win/) - "Game bonus notification"
- [Freesound Correct Bell](https://freesound.org/search/?q=correct+bell) - Search for "correct ding" or "success chime"
- **Quick Download**: [Mixkit - Achievement Bell](https://mixkit.co/free-sound-effects/achievement/)

**Specifications**:
- Duration: 0.5-1 seconds
- Type: Positive chime, success bell
- Format: MP3

### 2. wrong.mp3
**Purpose**: Sound effect when player answers incorrectly  
**Recommended sources**:
- [Mixkit Error Sound](https://mixkit.co/free-sound-effects/wrong/) - "Error notification"
- [Freesound Buzzer](https://freesound.org/search/?q=wrong+buzzer) - Search for "error buzz"
- **Quick Download**: [Mixkit - Cartoon Failure](https://mixkit.co/free-sound-effects/fail/)

**Specifications**:
- Duration: 0.5-1 seconds  
- Type: Buzzer, error beep
- Format: MP3

### 3. battle-bg.mp3
**Purpose**: Looping background music during battle  
**Recommended sources**:
- [Chosic Boss Battle Music](https://www.chosic.com/free-music/boss-battle/) - Royalty-free game music
- [Incompetech Action/Gaming](https://incompetech.com/music/royalty-free/music.html) - Filter by "Action" or "Dramatic"
- **Quick Download**: Try "Fierce Battle" or "Epic Battle" tracks

**Specifications**:
- Duration: 30-60 seconds (will loop)
- Type: Epic/energetic, suitable for boss battle
- Volume: Lower (0.2-0.3) to not overpower sound effects
- Format: MP3

## Installation Steps

1. Download the three audio files from the recommended sources above
2. Rename them to exactly: `correct.mp3`, `wrong.mp3`, `battle-bg.mp3`
3. Place them in: `public/sounds/`
4. The code will automatically find and play them

## License Note

All recommended sources provide royalty-free music for game/app use. Always verify the license before using.

## Alternative: Simple Placeholder BEEP sounds

If you want to test the system quickly without downloading, you can use browser-generated beep sounds (though quality will be lower). Let me know if you'd like me to create a simple beep generator utility.
