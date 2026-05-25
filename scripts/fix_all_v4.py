import os
import shutil
from PIL import Image, ImageDraw, ImageFilter

brain_prev = r"C:\Users\Leandro\.gemini\antigravity\brain\ce18a836-6317-4fdf-92fc-6bf9f51a79ef"
brain_curr = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"
pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

# ========== 1. Amelie - restore exact original ==========
shutil.copy2(os.path.join(brain_prev, "media__1779654869285.jpg"), os.path.join(pub, "mockup_amelie_front.jpg"))
shutil.copy2(os.path.join(brain_prev, "media__1779654869307.jpg"), os.path.join(pub, "mockup_amelie_back.jpg"))
print("Amelie: restored originals")

# ========== 2. Coffee Time - restore exact original ==========
shutil.copy2(os.path.join(brain_curr, "media__1779656692534.jpg"), os.path.join(pub, "mockup_coffee_time_front.jpg"))
print("Coffee Time: restored original")

# ========== 3. Maleva back - restore original, then fix to have 5 discs with white bg ==========
# Restore original back first
shutil.copy2(os.path.join(brain_prev, "media__1779653408692.jpg"), os.path.join(pub, "mockup_maleva_back.jpg"))
print("Maleva back: restored original (already has 4 discs)")

# The original back has 4 discs. User wants 5. Need to add 1 more disc.
# Let me check the disc positions in the original
back = Image.open(os.path.join(pub, "mockup_maleva_back.jpg")).convert("RGB")
w, h = back.size
print(f"Maleva back size: {w}x{h}")

# The original image (1024x571) has 4 discs on the right side
# Let me analyze disc positions by scanning the right edge for non-white/non-bg pixels
# The discs appear at roughly x=810-1000 area in the original

# Actually, the user says the back should have 5 discs.
# The original photo has 4 discs. I'll extract one disc as a template and add a 5th.
# Let me find the disc centers by scanning vertically
disc_x = 860  # approximate x center of discs
bg_color = back.getpixel((0, 0))

# Find disc regions by scanning down the right side
disc_centers = []
in_disc = False
disc_start = 0
for y in range(h):
    r, g, b = back.getpixel((disc_x, y))
    # Check if pixel is significantly different from background
    is_disc = abs(r - bg_color[0]) > 30 or abs(g - bg_color[1]) > 30 or abs(b - bg_color[2]) > 30
    if is_disc and not in_disc:
        disc_start = y
        in_disc = True
    elif not is_disc and in_disc:
        disc_centers.append((disc_start + y) // 2)
        in_disc = False

if in_disc:
    disc_centers.append((disc_start + h) // 2)

print(f"Found disc centers: {disc_centers}")
# We need 5 discs. If we have 4, we need to add 1 more.
# We'll redistribute 5 discs evenly across the same vertical span

if len(disc_centers) >= 2:
    first_y = disc_centers[0]
    last_y = disc_centers[-1]
    total_span = last_y - first_y
    
    # Extract a disc template from the first disc
    template_half = 25
    tc = disc_centers[0]
    disc_left = disc_x - 50
    disc_right = min(w, disc_x + 70)
    template = back.crop((disc_left, tc - template_half, disc_right, tc + template_half))
    
    # Create mask for blending
    tw, th = template.size
    mask = Image.new('L', (tw, th), 0)
    draw = ImageDraw.Draw(mask)
    cx, cy = tw // 2, th // 2
    rx, ry = tw // 2 - 2, th // 2 - 4
    draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=2))
    
    # Calculate 5 evenly spaced centers
    new_spacing = total_span / 4  # 4 gaps for 5 discs
    new_centers = [int(first_y + i * new_spacing) for i in range(5)]
    
    # Clear existing disc area with background color
    for y in range(first_y - template_half - 5, last_y + template_half + 5):
        if 0 <= y < h:
            for x in range(disc_left, disc_right):
                if 0 <= x < w:
                    back.putpixel((x, y), bg_color)
    
    # Paste 5 discs
    for cy_new in new_centers:
        paste_y = cy_new - template_half
        back.paste(template, (disc_left, paste_y), mask)
    
    back.save(os.path.join(pub, "mockup_maleva_back.jpg"), quality=95)
    print(f"Maleva back: added 5 discs at {new_centers}")

# ========== 4. Candy front - remove 1 disc (9 -> 8) ==========
candy = Image.open(os.path.join(pub, "mockup_candy_front.jpg")).convert("RGB")
cw, ch = candy.size
print(f"\nCandy front size: {cw}x{ch}")

# Discs are on the left side of the candy front
# Scan the left edge for disc positions
candy_disc_x = 30
candy_bg = candy.getpixel((0, 0))

candy_disc_centers = []
in_disc = False
disc_start = 0
for y in range(ch):
    r, g, b = candy.getpixel((candy_disc_x, y))
    is_disc = abs(r - candy_bg[0]) > 30 or abs(g - candy_bg[1]) > 30 or abs(b - candy_bg[2]) > 30
    if is_disc and not in_disc:
        disc_start = y
        in_disc = True
    elif not is_disc and in_disc:
        candy_disc_centers.append((disc_start, y, (disc_start + y) // 2))
        in_disc = False

if in_disc:
    candy_disc_centers.append((disc_start, ch, (disc_start + ch) // 2))

print(f"Candy front disc centers: {[c[2] for c in candy_disc_centers]}")
print(f"Number of discs found: {len(candy_disc_centers)}")

# If we have 9 discs, we need to remove the bottom one and redistribute as 8
if len(candy_disc_centers) >= 9:
    first_center = candy_disc_centers[0][2]
    last_center = candy_disc_centers[-1][2]
    total_span = last_center - first_center
    
    # Extract a disc template (the first one)
    tc = candy_disc_centers[0]
    half_h = (tc[1] - tc[0]) // 2 + 5
    disc_left_c = 0
    disc_right_c = 80
    
    # Get first disc template (pink)
    template_pink = candy.crop((disc_left_c, tc[2] - half_h, disc_right_c, tc[2] + half_h))
    # Get second disc template (sage/green)
    tc2 = candy_disc_centers[1]
    template_sage = candy.crop((disc_left_c, tc2[2] - half_h, disc_right_c, tc2[2] + half_h))
    
    ttw, tth = template_pink.size
    mask_c = Image.new('L', (ttw, tth), 0)
    draw_c = ImageDraw.Draw(mask_c)
    cx_c, cy_c = ttw // 2, tth // 2
    rx_c, ry_c = ttw // 2 - 1, tth // 2 - 3
    draw_c.ellipse([cx_c - rx_c, cy_c - ry_c, cx_c + rx_c, cy_c + ry_c], fill=255)
    mask_c = mask_c.filter(ImageFilter.GaussianBlur(radius=2))
    
    # Clear the entire disc column with background
    for y in range(first_center - half_h - 5, last_center + half_h + 5):
        if 0 <= y < ch:
            for x in range(disc_left_c, disc_right_c):
                if 0 <= x < cw:
                    # Sample from the right side of the image at similar y for background
                    candy.putpixel((x, y), candy_bg)
    
    # Place 8 discs evenly
    new_spacing_c = total_span / 7  # 7 gaps for 8 discs
    new_centers_c = [int(first_center + i * new_spacing_c) for i in range(8)]
    
    for i, cy_new in enumerate(new_centers_c):
        template = template_pink if i % 2 == 0 else template_sage
        paste_y = cy_new - half_h
        candy.paste(template, (disc_left_c, paste_y), mask_c)
    
    candy.save(os.path.join(pub, "mockup_candy_front.jpg"), quality=95)
    print(f"Candy front: redistributed to 8 discs at {new_centers_c}")
else:
    print(f"Candy front has {len(candy_disc_centers)} discs, expected 9")

print("\nDone!")
