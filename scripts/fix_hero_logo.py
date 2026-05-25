from PIL import Image, ImageDraw
import os

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"
hero_dst = os.path.join(pub, "mflower_hero_desk_new.jpg")

img = Image.open(hero_dst).convert("RGB")
w, h = img.size

# The Gemini logo is usually in the bottom right corner.
# Let's paint over a 100x100 square in the bottom right corner.
# We will sample the color from slightly above the logo.
bg_color = img.getpixel((w-10, h-120))

draw = ImageDraw.Draw(img)
draw.rectangle([w-100, h-100, w, h], fill=bg_color)

img.save(hero_dst, quality=100)
print(f"Removed logo from hero image. Size: {w}x{h}")
