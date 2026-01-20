# Needed Sprites

This document lists the sprites that need to be added to the project to complete the visual assets for items.

## 1. Clothing Items (High Priority)
These items are defined in `src/data/clothingItems.ts` but currently lack their corresponding PNG assets.

**Location:** `assets/sprites/clothes/`
**File Format:** PNG (Transparent background)
**Recommended Dimensions:** 1024x1024 (matching `hat_red.png` and others)

| ID | Filename | Description | Slot |
|----|----------|-------------|------|
| `hat_blue` | `hat_blue.png` | A blue version of the existing `hat_red.png`. | Head |
| `crown` | `crown.png` | A golden crown fit for a pet. | Head |
| `eyes_star` | `eyes_star.png` | Eyes with star shapes or sparkles, expressing excitement. | Eyes |
| `glasses` | `glasses.png` | A pair of glasses (sunglasses or reading glasses). | Eyes |
| `shirt_red` | `shirt_red.png` | A red version of the existing `shirt_blue.png`. | Torso |
| `dress_pink` | `dress_pink.png` | A cute pink dress. | Torso |
| `paws_socks` | `paws_socks.png` | Little socks for the pet's paws. | Paws |

## 2. Food Items (Optional)
Currently, food items use emojis in `src/data/foodItems.ts`. Replacing them with sprites would improve the game's aesthetic.

**Location:** `assets/sprites/food/` (New directory needed)
**File Format:** PNG (Transparent background)
**Recommended Dimensions:** 256x256 or 512x512

| ID | Filename | Description |
|----|----------|-------------|
| `kibble` | `kibble.png` | A bowl of dry pet food. |
| `fish` | `fish.png` | A fresh fish. |
| `treat` | `treat.png` | A bone or a cookie treat. |
| `milk` | `milk.png` | A bowl or carton of milk. |

## 3. Play Items (Optional)
Similar to food, play activities use emojis in `src/data/playActivities.ts`.

**Location:** `assets/sprites/toys/` (New directory needed)
**File Format:** PNG (Transparent background)
**Recommended Dimensions:** 256x256 or 512x512

| ID | Filename | Description |
|----|----------|-------------|
| `yarn_ball` | `yarn_ball.png` | A ball of yarn (colors like red or blue). |
| `small_ball` | `small_ball.png` | A small bouncy ball or tennis ball. |

## Technical Notes
- **Transparency:** All sprites must have a transparent background.
- **Style:** The style should match the existing vector/cartoon style of the base pets and current clothes.
- **Base Models:**
    - Cats: `assets/sprites/cats/cat_base.png` (768x768)
    - Dogs: `assets/sprites/dogs/dog_brown.png` (Dimensions likely similar)
    - Note that clothing assets (1024x1024) are larger than the base models, likely to allow for scaling and positioning adjustments.
