# Video Generation Prompts for Veo 3 / Nano Banana

## Overview

This document contains optimized prompts for generating pet animation videos using Google Veo 3 or Nano Banana. Videos will be converted to sprite sheets using frame extraction.

---

## Technical Output Settings

### For Veo 3 (Google)
```
Resolution: 1024x1024 (square format)
Duration: 1-2 seconds per animation
FPS: 24 fps (will extract every 2nd frame for 12fps sprite sheets)
Format: MP4 or WebM
Aspect Ratio: 1:1
```

### For Nano Banana
```
Resolution: 512x512 or 1024x1024
Duration: 1-2 seconds
FPS: 24 fps
Format: MP4
Style: Consistent across generations
```

---

## Frame Extraction Post-Processing

After generating videos, use FFmpeg to extract frames:

```bash
# Extract all frames as PNG (24fps source → 12fps sprite sheet)
ffmpeg -i cat_base_idle_video.mp4 -vf "fps=12,scale=256:256" -start_number 0 frame_%03d.png

# Combine frames into horizontal sprite sheet using ImageMagick
convert frame_*.png +append cat_base_idle.png

# Or use Python PIL for more control
python scripts/video_to_spritesheet.py cat_base_idle_video.mp4 --frames 12 --output cat_base_idle.png
```

---

## 🐱 CAT ANIMATIONS

### 1. Cat Idle Animation (Base/Orange Tabby)

**Veo 3 Prompt:**
```
A cute cartoon orange tabby cat character standing in idle position, 3/4 front view, looping animation. The cat gently sways side to side with subtle breathing motion. Tail slowly swishes left and right. Ears occasionally twitch. The cat stays in place, centered in frame. Smooth, gentle movements. Clean white background, consistent lighting. Character design: round body, big expressive eyes, friendly appearance. Animation style: casual mobile game, simple and appealing. Camera: static, front-facing. Loop seamlessly from end to start.

Technical: 1024x1024, 1 second loop, 24fps, perfect loop
```

**Nano Banana Prompt:**
```
Cute cartoon orange cat, idle stance, gentle breathing, tail swish, 3/4 view, white background, smooth looping animation, mobile game style, centered, 1 second perfect loop
```

---

### 2. Cat Eating Animation (Base/Orange Tabby)

**Veo 3 Prompt:**
```
A cute cartoon orange tabby cat character eating from a food bowl, 3/4 front view, looping animation. The cat's head bobs down to the bowl and back up rhythmically. Mouth opens and closes in chewing motion. Tail wags happily side to side. Front paws positioned near bowl. Character stays centered and in place. Clean white background. Animation duration: 0.67 seconds for natural eating rhythm. Character design: round friendly body, expressive eyes, appealing proportions. Style: casual mobile game aesthetic.

Technical: 1024x1024, 0.67 seconds (8 frames at 12fps), 24fps source, seamless loop
```

**Nano Banana Prompt:**
```
Cartoon orange cat eating from bowl, head bobbing, chewing motion, happy tail wag, 3/4 view, white background, looping animation, mobile game style, 0.7 seconds
```

---

### 3. Cat Happy Jump Animation (Base/Orange Tabby)

**Veo 3 Prompt:**
```
A cute cartoon orange tabby cat character performing a happy excited jump, 3/4 front view. The cat crouches slightly, then leaps upward with front paws lifted. Ears perk up, eyes wide with joy. Tail shoots upward. At peak of jump, all four paws are off the ground. Lands gently back in starting position. One complete jump cycle. Clean white background. Energetic but controlled motion. Character design: round body, big expressive eyes, friendly features. Style: casual mobile game, smooth animation.

Technical: 1024x1024, 0.83 seconds (10 frames at 12fps), 24fps source, non-looping (plays once then returns to idle)
```

**Nano Banana Prompt:**
```
Cartoon orange cat jumping joyfully, crouch to leap to land, front paws up, tail up, excited expression, 3/4 view, white background, smooth motion, mobile game style, single jump, 0.8 seconds
```

---

### 4. Cat Playing Animation (Base/Orange Tabby)

**Veo 3 Prompt:**
```
A cute cartoon orange tabby cat character playing energetically, 3/4 front view, looping animation. The cat pounces forward playfully with front paws extended, then returns to starting position. Tail raised high and swishing. Eyes focused and alert. Playful bouncing motion. Body stays centered in frame with forward-back movement. Clean white background. Energetic but smooth motion. Character design: round friendly body, big eyes, appealing proportions. Style: casual mobile game aesthetic.

Technical: 1024x1024, 0.8 seconds (12 frames at 15fps → extract 12 frames), 24fps source, seamless loop
```

**Nano Banana Prompt:**
```
Cartoon orange cat playing, pouncing motion, front paws extended, tail up, alert expression, 3/4 view, white background, energetic loop, mobile game style, 0.8 seconds
```

---

### 5. Cat Sleeping Animation (Base/Orange Tabby)

**Veo 3 Prompt:**
```
A cute cartoon orange tabby cat character sleeping peacefully, 3/4 front view, looping animation. The cat is curled up in a comfortable ball or lying down. Very slow, gentle breathing motion - chest and body rising and falling. Ear twitches subtly once during cycle. Tail wrapped around body, minimal movement. Eyes closed peacefully. Very minimal, calm animation. Clean white background. Soothing, gentle motion. Character design: round soft body, peaceful expression. Style: casual mobile game, very slow and relaxing.

Technical: 1024x1024, 1.33 seconds (8 frames at 6fps), 24fps source, seamless loop
```

**Nano Banana Prompt:**
```
Cartoon orange cat sleeping curled up, slow breathing, peaceful, minimal movement, ear twitch, 3/4 view, white background, gentle loop, mobile game style, very slow, 1.3 seconds
```

---

### 6. Cat Bathing Shake Animation (Base/Orange Tabby)

**Veo 3 Prompt:**
```
A cute cartoon orange tabby cat character shaking water off after a bath, 3/4 front view. The cat's entire body shakes vigorously from head to tail in a rapid shaking motion. Fur appears slightly wet with darker color tones. Water droplets fly off in all directions (implied by motion blur). Eyes squinted during shake. Ears flapping with the motion. Fast, energetic shake animation. Clean white background. Character design: round body, expressive features. Style: casual mobile game, exaggerated shake motion for comedic effect.

Technical: 1024x1024, 0.4 seconds (8 frames at 20fps → extract 8 frames), 24fps source, plays 3 times then transitions to happy
```

**Nano Banana Prompt:**
```
Cartoon orange cat shaking water off, full body shake, wet fur, motion blur, water droplets, vigorous motion, 3/4 view, white background, fast animation, mobile game style, 0.4 seconds
```

---

### 7. Cat Tired Animation (Base/Orange Tabby)

**Veo 3 Prompt:**
```
A cute cartoon orange tabby cat character looking tired and sleepy, 3/4 front view, looping animation. The cat sits with slightly slumped posture. Head occasionally nods downward as if dozing off, then perks back up. Eyes half-closed, blinking slowly. Tail lies flat and still. Slow, lethargic movements. Yawning motion halfway through cycle. Clean white background. Character design: round body, droopy expression. Style: casual mobile game, slow and weary motion.

Technical: 1024x1024, 1.0 seconds (8 frames at 8fps), 24fps source, seamless loop
```

**Nano Banana Prompt:**
```
Cartoon orange cat looking tired, head nodding, half-closed eyes, slow blink, slumped posture, yawning, 3/4 view, white background, slow loop, mobile game style, 1 second
```

---

### 8. Cat Sick Animation (Base/Orange Tabby)

**Veo 3 Prompt:**
```
A cute cartoon orange tabby cat character looking unwell and sick, 3/4 front view, looping animation. The cat sits with lowered head and droopy posture. Slight swaying motion as if dizzy or weak. Eyes half-closed with sad expression. Ears drooping down. Tail limp and still. Very slow, unsteady movements. Perhaps slight green tint to indicate sickness (optional). Clean white background. Character design: round body, sad/unwell expression. Style: casual mobile game, communicate sickness through posture and movement.

Technical: 1024x1024, 1.33 seconds (8 frames at 6fps), 24fps source, seamless loop
```

**Nano Banana Prompt:**
```
Cartoon orange cat looking sick, droopy posture, lowered head, sad expression, dizzy sway, ears down, weak movement, 3/4 view, white background, slow loop, mobile game style, 1.3 seconds
```

---

## 🐱 BLACK CAT VARIANTS

**For black cat versions**, use the exact same prompts above but replace:
- "orange tabby cat" → "black cat"
- Keep all other parameters identical

**Example:**
```
A cute cartoon black cat character standing in idle position, 3/4 front view, looping animation...
```

---

## 🐕 DOG ANIMATIONS

### 1. Dog Idle Animation (Brown)

**Veo 3 Prompt:**
```
A cute cartoon brown dog character standing in idle position, 3/4 front view, looping animation. The dog gently shifts weight from paw to paw with subtle breathing motion. Tail wags slowly and happily. Ears perk up and relax. Tongue slightly out in friendly panting. The dog stays in place, centered in frame. Smooth, friendly movements. Clean white background, consistent lighting. Character design: medium-sized friendly dog, floppy ears, big expressive eyes, appealing proportions. Animation style: casual mobile game. Camera: static, front-facing. Loop seamlessly from end to start.

Technical: 1024x1024, 1 second loop, 24fps, perfect loop
```

**Nano Banana Prompt:**
```
Cute cartoon brown dog, idle stance, gentle breathing, tail wag, tongue out, 3/4 view, white background, smooth looping animation, mobile game style, centered, 1 second perfect loop
```

---

### 2. Dog Eating Animation (Brown)

**Veo 3 Prompt:**
```
A cute cartoon brown dog character eating from a food bowl, 3/4 front view, looping animation. The dog's head dips down to the bowl enthusiastically. Mouth opens wide and chomps. Tail wags vigorously and energetically. Front paws positioned near bowl, possibly one paw tapping excitedly. Character stays centered. Clean white background. Enthusiastic eating motion - dogs eat faster than cats! Character design: medium-sized friendly dog, floppy ears, expressive eyes. Style: casual mobile game aesthetic.

Technical: 1024x1024, 0.67 seconds (8 frames at 12fps), 24fps source, seamless loop
```

**Nano Banana Prompt:**
```
Cartoon brown dog eating from bowl enthusiastically, head bobbing, chomping, vigorous tail wag, excited, 3/4 view, white background, looping animation, mobile game style, 0.7 seconds
```

---

### 3. Dog Happy Jump Animation (Brown)

**Veo 3 Prompt:**
```
A cute cartoon brown dog character performing an excited happy jump, 3/4 front view. The dog crouches low, then springs upward energetically with front paws lifted high. Ears fly up with the motion. Mouth open in happy panting/smile. Tail straight up and wagging at peak of jump. All four paws off the ground at peak. Lands enthusiastically back in starting position. One complete jump cycle. Clean white background. Very energetic dog-like motion. Character design: medium-sized friendly dog, floppy ears, joyful expression. Style: casual mobile game.

Technical: 1024x1024, 0.83 seconds (10 frames at 12fps), 24fps source, non-looping
```

**Nano Banana Prompt:**
```
Cartoon brown dog jumping excitedly, crouch to big leap to land, front paws high, tail up, happy expression, mouth open, 3/4 view, white background, energetic motion, mobile game style, single jump, 0.8 seconds
```

---

### 4. Dog Playing Animation (Brown)

**Veo 3 Prompt:**
```
A cute cartoon brown dog character playing energetically, 3/4 front view, looping animation. The dog does a playful "play bow" - front end lowered with rear up, tail wagging wildly. Then bounces forward in play position. Very energetic, bouncy motion. Ears flopping with movement. Tongue out, happy expression. Body stays mostly centered with forward-back playful motion. Clean white background. Energetic and enthusiastic dog movement. Character design: medium-sized friendly dog, expressive features. Style: casual mobile game.

Technical: 1024x1024, 0.8 seconds (12 frames at 15fps → extract 12 frames), 24fps source, seamless loop
```

**Nano Banana Prompt:**
```
Cartoon brown dog in play bow, bouncing playfully, tail wagging wildly, tongue out, energetic, floppy ears, 3/4 view, white background, energetic loop, mobile game style, 0.8 seconds
```

---

### 5. Dog Sleeping Animation (Brown)

**Veo 3 Prompt:**
```
A cute cartoon brown dog character sleeping peacefully, 3/4 front view, looping animation. The dog is lying down on its side or curled up comfortably. Gentle breathing motion - chest rising and falling slowly. Ears occasionally twitch during sleep. Tail resting peacefully. Maybe a small dream movement (leg twitch). Eyes closed peacefully. Very gentle, calm animation. Clean white background. Soothing, peaceful motion. Character design: medium-sized dog, soft relaxed body. Style: casual mobile game, very slow and calming.

Technical: 1024x1024, 1.33 seconds (8 frames at 6fps), 24fps source, seamless loop
```

**Nano Banana Prompt:**
```
Cartoon brown dog sleeping peacefully, lying down, slow breathing, ear twitch, peaceful, minimal movement, 3/4 view, white background, gentle loop, mobile game style, very slow, 1.3 seconds
```

---

### 6. Dog Bathing Shake Animation (Brown)

**Veo 3 Prompt:**
```
A cute cartoon brown dog character shaking water off after a bath, 3/4 front view. The dog's entire body shakes vigorously in classic "wet dog shake" from head to tail in rapid succession. Fur appears wet and slightly darker. Water droplets spray in all directions (implied by motion blur and spray effects). Ears flapping wildly with the shake. Eyes squinted, tongue out. Very fast, vigorous dog shake. Clean white background. Character design: medium-sized dog, wet fur texture. Style: casual mobile game, exaggerated shake for comedic effect.

Technical: 1024x1024, 0.4 seconds (8 frames at 20fps → extract 8 frames), 24fps source, plays 3 times then transitions to happy
```

**Nano Banana Prompt:**
```
Cartoon brown dog shaking water off vigorously, full body wet dog shake, wet fur, water spray, motion blur, ears flapping, fast motion, 3/4 view, white background, fast animation, mobile game style, 0.4 seconds
```

---

### 7. Dog Tired Animation (Brown)

**Veo 3 Prompt:**
```
A cute cartoon brown dog character looking tired and exhausted, 3/4 front view, looping animation. The dog sits or lies down with slumped posture. Head droops forward, then lifts back up slowly. Eyes half-closed, blinking slowly. Tongue hanging out tiredly. Tail lies flat and motionless. Heavy breathing motion visible in chest. Slow, weary movements. Big yawn halfway through cycle. Clean white background. Character design: medium-sized dog, exhausted expression. Style: casual mobile game, slow and tired motion.

Technical: 1024x1024, 1.0 seconds (8 frames at 8fps), 24fps source, seamless loop
```

**Nano Banana Prompt:**
```
Cartoon brown dog looking exhausted, droopy posture, head drooping, tongue out, half-closed eyes, heavy breathing, yawning, 3/4 view, white background, slow loop, mobile game style, 1 second
```

---

### 8. Dog Sick Animation (Brown)

**Veo 3 Prompt:**
```
A cute cartoon brown dog character looking sick and unwell, 3/4 front view, looping animation. The dog sits or lies down with very low energy. Head hanging low, ears completely drooping down. Eyes barely open with sad, sick expression. No tail wagging - tail lies completely still. Slight swaying as if dizzy or weak. Very slow, lethargic movements. Possibly slight green tint or "sick" visual indicators. Clean white background. Character design: medium-sized dog, clearly unwell posture. Style: casual mobile game, communicate illness through body language.

Technical: 1024x1024, 1.33 seconds (8 frames at 6fps), 24fps source, seamless loop
```

**Nano Banana Prompt:**
```
Cartoon brown dog looking very sick, low energy, head down, droopy ears, sad eyes, no tail wag, dizzy sway, weak movement, 3/4 view, white background, slow loop, mobile game style, 1.3 seconds
```

---

## 🐕 DOG COLOR VARIANTS

### Black Dog
Replace "brown dog" → "black dog" in all prompts

### White and Brown Dog
Replace "brown dog" → "white and brown spotted dog" or "white dog with brown patches"

---

## Post-Processing Workflow

### Step 1: Generate Videos

Use the prompts above in Veo 3 or Nano Banana to generate videos for each animation.

### Step 2: Extract Frames

```bash
# Create directory for frames
mkdir -p frames/cat_base_idle

# Extract frames at correct FPS
ffmpeg -i cat_base_idle_video.mp4 -vf "fps=12" frames/cat_base_idle/frame_%04d.png

# Resize if needed
mogrify -resize 256x256 frames/cat_base_idle/*.png
```

### Step 3: Create Sprite Sheet

```bash
# Using ImageMagick (horizontal strip)
convert frames/cat_base_idle/*.png +append sprites/cat_base_idle.png

# Or using Python script
python tools/create_spritesheet.py \
  --input frames/cat_base_idle \
  --output sprites/cat_base_idle.png \
  --frames 12 \
  --width 256 \
  --height 256
```

### Step 4: Optimize

```bash
# Optimize PNG size
pngquant --quality=80-95 sprites/cat_base_idle.png -o sprites/cat_base_idle_optimized.png

# Or use optipng
optipng -o7 sprites/cat_base_idle.png
```

### Step 5: Verify

- Check sprite sheet dimensions: should be (256 × frameCount) × 256
- Verify each frame looks correct
- Test in game with `useSpriteSheets={true}`

---

## Python Helper Script

```python
# tools/create_spritesheet.py
import os
from PIL import Image
import argparse

def create_spritesheet(input_dir, output_path, frame_width=256, frame_height=256):
    """Combine individual frames into horizontal sprite sheet"""

    # Get all PNG files sorted
    frames = sorted([f for f in os.listdir(input_dir) if f.endswith('.png')])

    if not frames:
        print("No frames found!")
        return

    # Load first frame to get dimensions
    first_frame = Image.open(os.path.join(input_dir, frames[0]))

    # Create sprite sheet
    sprite_width = frame_width * len(frames)
    sprite_sheet = Image.new('RGBA', (sprite_width, frame_height), (0, 0, 0, 0))

    # Paste each frame
    for i, frame_file in enumerate(frames):
        frame = Image.open(os.path.join(input_dir, frame_file))
        frame = frame.resize((frame_width, frame_height), Image.Resampling.LANCZOS)
        sprite_sheet.paste(frame, (i * frame_width, 0))
        print(f"Added frame {i+1}/{len(frames)}: {frame_file}")

    # Save
    sprite_sheet.save(output_path, 'PNG', optimize=True)
    print(f"\n✅ Sprite sheet created: {output_path}")
    print(f"   Dimensions: {sprite_width}x{frame_height}")
    print(f"   Frames: {len(frames)}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Create sprite sheet from frames')
    parser.add_argument('--input', required=True, help='Input directory with frames')
    parser.add_argument('--output', required=True, help='Output sprite sheet path')
    parser.add_argument('--width', type=int, default=256, help='Frame width')
    parser.add_argument('--height', type=int, default=256, help='Frame height')

    args = parser.parse_args()
    create_spritesheet(args.input, args.output, args.width, args.height)
```

---

## Checklist

For each pet variant (5 total):

- [ ] Cat Base - 8 animations
- [ ] Cat Black - 8 animations
- [ ] Dog Brown - 8 animations
- [ ] Dog Black - 8 animations
- [ ] Dog White & Brown - 8 animations

**Total: 40 sprite sheets to generate**

---

## Tips for Best Results

### For Veo 3:
1. Use "3/4 front view" consistently for best character consistency
2. Specify "clean white background" for easy compositing
3. Emphasize "seamless loop" for looping animations
4. Use precise duration/frame counts in technical specs
5. Request "casual mobile game" style for consistency

### For Nano Banana:
1. Keep prompts concise but descriptive
2. Focus on key motion descriptors
3. Specify timing clearly
4. Maintain consistent style across generations

### General:
1. Generate all animations for one pet before moving to next
2. Use the same prompt structure for consistency
3. Keep character proportions consistent across animations
4. Verify loop points before creating sprite sheets
5. Test in-game early to catch issues

---

## Alternative: Commission an Artist

If video generation doesn't yield desired results, these prompts can be adapted for commissioning a 2D animator:

- Provide frame counts and FPS specs
- Reference casual mobile game style (Neko Atsume, Tamagotchi, etc.)
- Share technical requirements (256x256 frames, horizontal strips)
- Use the animation descriptions as reference

---

Good luck with your pet animations! 🎬🐱🐕
