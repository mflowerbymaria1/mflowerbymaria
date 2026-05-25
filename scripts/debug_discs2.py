from PIL import Image
import os

brain_prev = r"C:\Users\Leandro\.gemini\antigravity\brain\ce18a836-6317-4fdf-92fc-6bf9f51a79ef"
brain_curr = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"

# Maleva back
back = Image.open(os.path.join(brain_prev, "media__1779653408692.jpg")).convert("RGB")
w, h = back.size
bg = back.getpixel((0, 0))
print(f"Maleva back: {w}x{h}, bg={bg}")

# Scan with very low threshold
for x in [900, 920, 940, 960, 980, 1000, 1010]:
    print(f"\nx={x}:")
    for y in range(0, h, 5):
        r, g, b = back.getpixel((x, y))
        diff = abs(r - bg[0]) + abs(g - bg[1]) + abs(b - bg[2])
        if diff > 10:
            print(f"  y={y}: ({r},{g},{b}) diff={diff}")

# Candy front
candy = Image.open(os.path.join(brain_curr, "media__1779657892874.jpg")).convert("RGB")
cw, ch = candy.size
cbg = candy.getpixel((0, 0))
print(f"\nCandy front: {cw}x{ch}, bg={cbg}")

for x in [15, 25, 35, 45, 55, 65]:
    non_bg = []
    for y in range(0, ch, 3):
        r, g, b = candy.getpixel((x, y))
        diff = abs(r - cbg[0]) + abs(g - cbg[1]) + abs(b - cbg[2])
        if diff > 5:
            non_bg.append((y, r, g, b, diff))
    if non_bg:
        print(f"\nx={x}: {len(non_bg)} non-bg pixels")
        for nb in non_bg[:30]:
            print(f"  y={nb[0]}: ({nb[1]},{nb[2]},{nb[3]}) diff={nb[4]}")
