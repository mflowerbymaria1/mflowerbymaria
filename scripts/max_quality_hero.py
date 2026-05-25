from PIL import Image, ImageDraw
import os

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"
brain = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"

src_path = os.path.join(brain, "media__1779671229612.jpg")
dst_path = os.path.join(pub, "mflower_hero_desk_new.jpg")

img = Image.open(src_path).convert("RGB")
w, h = img.size

# Remove Gemini logo at bottom right
bg_color = img.getpixel((w-50, h-150))
draw = ImageDraw.Draw(img)
draw.rectangle([w-120, h-120, w, h], fill=bg_color)

# Save with maximum possible JPEG quality to prevent degradation
img.save(dst_path, quality=100, subsampling=0)
print(f"Saved hero image with max quality. Size: {img.size}")
