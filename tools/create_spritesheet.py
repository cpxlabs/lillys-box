#!/usr/bin/env python3
"""
Sprite Sheet Creator - Convert video frames to horizontal sprite sheets

Usage:
    python create_spritesheet.py --input frames/cat_base_idle --output sprites/cat_base_idle.png
    python create_spritesheet.py --input frames/ --output sprites/ --batch
"""

import os
import sys
from PIL import Image
import argparse
from pathlib import Path


def create_spritesheet(input_dir, output_path, frame_width=256, frame_height=256, verbose=True):
    """
    Combine individual frames into horizontal sprite sheet

    Args:
        input_dir: Directory containing frame images
        output_path: Path for output sprite sheet
        frame_width: Width of each frame (default: 256)
        frame_height: Height of each frame (default: 256)
        verbose: Print progress messages
    """
    input_path = Path(input_dir)

    if not input_path.exists():
        print(f"❌ Error: Input directory not found: {input_dir}")
        return False

    # Get all PNG files sorted
    frames = sorted([f for f in os.listdir(input_dir) if f.lower().endswith('.png')])

    if not frames:
        print(f"❌ Error: No PNG frames found in {input_dir}")
        return False

    if verbose:
        print(f"🎬 Creating sprite sheet from {len(frames)} frames...")

    try:
        # Create sprite sheet
        sprite_width = frame_width * len(frames)
        sprite_sheet = Image.new('RGBA', (sprite_width, frame_height), (0, 0, 0, 0))

        # Paste each frame
        for i, frame_file in enumerate(frames):
            frame_path = input_path / frame_file
            frame = Image.open(frame_path)

            # Resize if needed
            if frame.size != (frame_width, frame_height):
                frame = frame.resize((frame_width, frame_height), Image.Resampling.LANCZOS)

            # Convert to RGBA if needed
            if frame.mode != 'RGBA':
                frame = frame.convert('RGBA')

            sprite_sheet.paste(frame, (i * frame_width, 0))

            if verbose:
                print(f"  ✓ Frame {i+1}/{len(frames)}: {frame_file}")

        # Ensure output directory exists
        output_path_obj = Path(output_path)
        output_path_obj.parent.mkdir(parents=True, exist_ok=True)

        # Save
        sprite_sheet.save(output_path, 'PNG', optimize=True)

        if verbose:
            print(f"\n✅ Sprite sheet created: {output_path}")
            print(f"   Dimensions: {sprite_width}x{frame_height}")
            print(f"   Frames: {len(frames)}")
            print(f"   File size: {output_path_obj.stat().st_size / 1024:.1f} KB")

        return True

    except Exception as e:
        print(f"❌ Error creating sprite sheet: {e}")
        return False


def batch_process(input_root, output_root, frame_width=256, frame_height=256):
    """
    Batch process multiple frame directories

    Args:
        input_root: Root directory containing subdirectories of frames
        output_root: Root directory for output sprite sheets
        frame_width: Width of each frame
        frame_height: Height of each frame
    """
    input_path = Path(input_root)

    if not input_path.exists():
        print(f"❌ Error: Input root directory not found: {input_root}")
        return

    # Find all subdirectories with PNG files
    frame_dirs = []
    for item in input_path.iterdir():
        if item.is_dir():
            png_files = list(item.glob('*.png'))
            if png_files:
                frame_dirs.append(item)

    if not frame_dirs:
        print(f"❌ No frame directories found in {input_root}")
        return

    print(f"🎬 Batch processing {len(frame_dirs)} sprite sheets...\n")

    success_count = 0
    for frame_dir in frame_dirs:
        output_filename = f"{frame_dir.name}.png"
        output_path = Path(output_root) / output_filename

        print(f"\n{'='*60}")
        print(f"Processing: {frame_dir.name}")
        print(f"{'='*60}")

        success = create_spritesheet(
            str(frame_dir),
            str(output_path),
            frame_width,
            frame_height,
            verbose=True
        )

        if success:
            success_count += 1

    print(f"\n{'='*60}")
    print(f"✅ Batch complete: {success_count}/{len(frame_dirs)} sprite sheets created")
    print(f"{'='*60}")


def extract_frames_from_video(video_path, output_dir, fps=12, frame_width=256, frame_height=256):
    """
    Extract frames from video using ffmpeg

    Requires ffmpeg to be installed on the system.

    Args:
        video_path: Path to input video
        output_dir: Directory for output frames
        fps: Frames per second to extract
        frame_width: Width to resize frames to
        frame_height: Height to resize frames to
    """
    import subprocess

    video_path_obj = Path(video_path)
    if not video_path_obj.exists():
        print(f"❌ Error: Video file not found: {video_path}")
        return False

    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    print(f"🎬 Extracting frames from {video_path_obj.name}...")
    print(f"   FPS: {fps}")
    print(f"   Size: {frame_width}x{frame_height}")
    print(f"   Output: {output_dir}")

    try:
        # Build ffmpeg command
        cmd = [
            'ffmpeg',
            '-i', str(video_path),
            '-vf', f'fps={fps},scale={frame_width}:{frame_height}',
            '-start_number', '0',
            str(output_path / 'frame_%04d.png')
        ]

        # Run ffmpeg
        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode == 0:
            # Count extracted frames
            frames = list(output_path.glob('frame_*.png'))
            print(f"✅ Extracted {len(frames)} frames to {output_dir}")
            return True
        else:
            print(f"❌ ffmpeg error: {result.stderr}")
            return False

    except FileNotFoundError:
        print("❌ Error: ffmpeg not found. Please install ffmpeg first.")
        print("   macOS: brew install ffmpeg")
        print("   Ubuntu: sudo apt install ffmpeg")
        print("   Windows: Download from https://ffmpeg.org/")
        return False
    except Exception as e:
        print(f"❌ Error extracting frames: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description='Create sprite sheets from video frames',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Create single sprite sheet
  python create_spritesheet.py --input frames/cat_base_idle --output sprites/cat_base_idle.png

  # Batch process multiple animations
  python create_spritesheet.py --input frames/ --output sprites/ --batch

  # Extract frames from video first
  python create_spritesheet.py --video cat_idle.mp4 --extract frames/cat_base_idle --fps 12

  # Extract and create sprite sheet in one go
  python create_spritesheet.py --video cat_idle.mp4 --extract frames/cat_base_idle --output sprites/cat_base_idle.png --fps 12
        """
    )

    parser.add_argument('--input', help='Input directory with frames')
    parser.add_argument('--output', help='Output sprite sheet path')
    parser.add_argument('--width', type=int, default=256, help='Frame width (default: 256)')
    parser.add_argument('--height', type=int, default=256, help='Frame height (default: 256)')
    parser.add_argument('--batch', action='store_true', help='Batch process multiple frame directories')
    parser.add_argument('--video', help='Extract frames from video file (requires ffmpeg)')
    parser.add_argument('--extract', help='Output directory for extracted frames')
    parser.add_argument('--fps', type=int, default=12, help='FPS for frame extraction (default: 12)')
    parser.add_argument('--quiet', action='store_true', help='Suppress progress messages')

    args = parser.parse_args()

    # Validate arguments
    if args.video and not args.extract:
        print("❌ Error: --extract required when using --video")
        sys.exit(1)

    if not args.video and not args.input:
        print("❌ Error: Either --input or --video must be specified")
        parser.print_help()
        sys.exit(1)

    # Extract frames from video if requested
    if args.video:
        success = extract_frames_from_video(
            args.video,
            args.extract,
            args.fps,
            args.width,
            args.height
        )
        if not success:
            sys.exit(1)

        # Use extracted frames as input if output is specified
        if args.output:
            args.input = args.extract

    # Create sprite sheet(s)
    if args.batch:
        if not args.input or not args.output:
            print("❌ Error: Both --input and --output required for batch mode")
            sys.exit(1)
        batch_process(args.input, args.output, args.width, args.height)
    elif args.output:
        if not args.input:
            print("❌ Error: --input required")
            sys.exit(1)
        success = create_spritesheet(
            args.input,
            args.output,
            args.width,
            args.height,
            verbose=not args.quiet
        )
        sys.exit(0 if success else 1)
    else:
        print("❌ Error: --output required (unless using --batch)")
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
