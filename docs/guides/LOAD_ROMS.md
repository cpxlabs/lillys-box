# Loading Games in GBA Emulator 🕹️

Complete guide for importing and playing GBA ROMs in Lilly's Box.

## Quick Start

```
1. Open the GBA Emulator from the game selection menu
2. Tap "Import ROM" and select your .gba file
3. Tap the game in your library to start playing
```

> ⚠️ **Important**: Only import ROMs you legally own. Lilly's Box does not provide, distribute, or endorse downloading copyrighted game files.

---

## Overview

The GBA Emulator in Lilly's Box lets you play Game Boy Advance games using your own ROM files. It's designed with a family-friendly interface while giving you full emulation capabilities.

### Key Features

| Feature | Description |
|---------|-------------|
| 🎮 **ROM Library** | Organize and browse your imported games |
| 💾 **Save States** | Save and load progress at any point |
| 🎛️ **Touch Controls** | On-screen D-pad, A/B, Start/Select buttons |
| 📱 **Landscape Mode** | Optimized gameplay in landscape orientation |
| 🔄 **Auto-Resume** | Pick up where you left off automatically |

---

## Importing ROMs

### Step 1: Open the Emulator

From the main menu, scroll to find the **GBA Emulator** (🕹️) in the games list and tap to open it.

### Step 2: Access ROM Import

On the emulator home screen, tap the **Import ROM** button to open the file picker.

### Step 3: Select Your ROM File

Browse your device storage and select a `.gba` file:

| Platform | How to Access Files |
|----------|---------------------|
| **Android** | Browse internal storage, Downloads, or SD card |
| **iOS** | Access Files app, iCloud Drive, or On My iPhone |
| **Web** | Use your browser's file picker dialog |

### Step 4: Wait for Import

The emulator will:
1. Validate the ROM file format
2. Generate a unique hash for save data
3. Add the game to your library
4. Display the game with detected metadata

### Step 5: Start Playing

Tap the imported game in your ROM Library to launch it!

---

## ROM Library Management

### Browsing Your Games

The ROM Library shows all imported games with:
- **Recent Games** - Quick access to recently played titles
- **All Games** - Complete alphabetical list
- **Favorites** - Games you've marked as favorites

### Game Information

Each game entry displays:
- Game title (detected from ROM or filename)
- Last played date
- Play time
- Save state indicator

### Managing Games

| Action | How To |
|--------|--------|
| **Play** | Tap the game card |
| **Favorite** | Long press → "Add to Favorites" |
| **Delete** | Long press → "Remove from Library" |
| **View Details** | Long press → "Game Info" |

---

## Save Data

### Automatic Saves

The emulator automatically saves your progress using:
- **Battery Save (SRAM)** - In-game saves work as expected
- **Auto-Resume** - Your exact position when you exit

### Save States

Save states let you save and load at any moment:

| Slot | Purpose |
|------|---------|
| **Auto** | Created when exiting a game |
| **Slot 1-3** | Manual save state slots |

#### Creating a Save State

1. During gameplay, tap the **Menu** overlay (top of screen)
2. Tap **Save State**
3. Select a slot (1, 2, or 3)
4. Confirm to save

#### Loading a Save State

1. Tap **Menu** during gameplay
2. Tap **Load State**
3. Select the slot to restore
4. Game jumps to that exact moment

### Save Data Storage

Saves are stored locally on your device:

```
Storage Keys:
├── @gba_library_index     (list of imported ROMs)
├── @gba_recent_roms       (recently played order)
├── @gba_settings          (emulator preferences)
├── @gba_save_<romHash>    (battery/SRAM saves)
└── @gba_state_<slot>_<romHash>  (save states)
```

> 💡 **Tip**: Save data is tied to the ROM's content hash, not the filename. Renaming a ROM file won't affect your saves.

---

## Controls

### Touch Controls Layout

In landscape mode:

```
┌─────────────────────────────────────────────────────┐
│  [Menu]              GAME SCREEN              [Save]│
├─────────────────────────────────────────────────────┤
│                                                     │
│                                                     │
│    ┌───┐                                   ┌───┐   │
│    │ ▲ │                                   │ A │   │
│  ┌─┴───┴─┐                               ┌─┴───┴─┐ │
│  │◄     ►│                               │ B     │ │
│  └─┬───┬─┘                               └───────┘ │
│    │ ▼ │         [Select] [Start]                  │
│    └───┘                                           │
└─────────────────────────────────────────────────────┘
```

### Control Reference

| Button | Action |
|--------|--------|
| **D-Pad** | Move character / Navigate menus |
| **A** | Confirm / Primary action |
| **B** | Cancel / Secondary action |
| **Start** | Pause / Game menu |
| **Select** | Special function (game-specific) |
| **L/R** | Shoulder buttons (available in settings) |

### Customizing Controls

1. From the emulator home screen, tap **Settings**
2. Select **Controls**
3. Adjust button size, position, and opacity
4. Enable/disable shoulder buttons (L/R)

---

## Platform-Specific Notes

### Android

- **File Access**: ROMs can be imported from internal storage, SD card, or cloud storage apps
- **Performance**: Best performance on devices with Android 8.0+
- **Storage**: Saves are stored in app-private storage

### iOS

- **File Access**: Use the Files app to access ROMs from iCloud, local storage, or connected drives
- **Performance**: Optimized for iOS 13.4+
- **Storage**: Saves are stored in app container

### Web

- **File Access**: Standard browser file picker
- **Performance**: Depends on browser and device capabilities
- **Storage**: Uses browser localStorage (limited to ~5MB per origin)
- **Note**: Web saves don't sync between devices

---

## Troubleshooting

### ROM Won't Import

**Symptoms**: Import fails or ROM doesn't appear in library

**Solutions**:
- ✅ Verify the file has a `.gba` extension
- ✅ Ensure the file isn't corrupted (try on another emulator)
- ✅ Check you have storage permissions enabled
- ✅ Ensure sufficient device storage space

### Game Won't Start

**Symptoms**: Black screen or crash when launching

**Solutions**:
- ✅ Try re-importing the ROM
- ✅ Check if the ROM requires a BIOS (not supported)
- ✅ Some ROMs may have compatibility issues

### Saves Not Working

**Symptoms**: In-game saves don't persist

**Solutions**:
- ✅ Wait a few seconds after saving before exiting
- ✅ Use save states as a backup
- ✅ Check device storage isn't full
- ✅ On web, ensure localStorage isn't disabled

### Controls Unresponsive

**Symptoms**: Touch inputs don't register properly

**Solutions**:
- ✅ Ensure fingers are on the touch targets
- ✅ Try increasing button size in Settings
- ✅ Restart the game if inputs become stuck
- ✅ Check for screen protector interference

### Poor Performance

**Symptoms**: Lag, stuttering, or audio issues

**Solutions**:
- ✅ Close other apps to free memory
- ✅ Ensure device isn't in power-saving mode
- ✅ Some games are more demanding than others
- ✅ Try the web version if mobile has issues (or vice versa)

---

## Legal Notice

### ROM Policy

Lilly's Box provides **emulation capability only**. The app:

- ❌ Does NOT include any game ROMs
- ❌ Does NOT provide ROM downloads
- ❌ Does NOT link to ROM distribution sites
- ✅ Supports user-imported ROM files only

### Your Responsibility

You are responsible for ensuring you have the legal right to use any ROM files you import. This typically means:

- Creating backup copies of games you physically own
- Using homebrew games created by independent developers
- Playing games in the public domain

### BIOS Files

The emulator uses a built-in open-source BIOS implementation. No Nintendo BIOS files are required or supported.

---

## See Also

- [EMULATOR.md](../technical/EMULATOR.md) - Technical emulator architecture
- [BUILD.md](BUILD.md) - Building the app for different platforms
- [RESPONSIVE.md](RESPONSIVE.md) - Touch control sizing

---

**Last Updated**: 2026-03-10  
**Status**: Complete
