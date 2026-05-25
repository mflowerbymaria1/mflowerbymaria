from PIL import Image
import os

brain_prev = r"C:\Users\Leandro\.gemini\antigravity\brain\ce18a836-6317-4fdf-92fc-6bf9f51a79ef"

# Check pixel colors along the disc column of maleva back
back = Image.open(os.path.join(brain_prev, "media__1779653408692.jpg")).convert("RGB")
w, h = back.size
print(f"Maleva back original: {w}x{h}")

# Sample colors at different x positions on right side to find discs
for x in [820, 860, 900, 940, 960, 980, 1000]:
    print(f"\nx={x}:")
    for y in range(0, h, 20):
        r, g, b = back.getpixel((x, y))
        if r < 240 or g < 240 or b < 240:  # not white-ish
            print(f"  y={y}: ({r},{g},{b})")

# Also check candy front on the left
brain_curr = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"
candy = Image.open(os.path.join(brain_curr, "media__1779657892874.jpg")).convert("RGB")
cw, ch = candy.size
print(f"\nCandy front original: {cw}x{ch}")
print(f"Top-left pixel: {candy.getpixel((0,0))}")
print(f"Scanning left edge for discs:")
for x in [10, 20, 30, 40, 50]:
    print(f"\nx={x}:")
    for y in range(0, ch, 15):
        r, g, b = candy.getpixel((x, y))
        if r < 230 or g < 230 or b < 230:
            print(f"  y={y}: ({r},{g},{b})")
