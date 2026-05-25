from PIL import Image
import os
import shutil

brain = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"
pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

# 1. Hero image
hero_src = os.path.join(brain, "media__1779660502720.jpg")
hero_dst = os.path.join(pub, "mflower_hero_desk_new.jpg")
img_hero = Image.open(hero_src)
# The original hero image was 640x640 (but wait, it was actually displayed as cover).
# I'll crop the center of the vertical image to make it 1024x768 (a good landscape format for hero)
# Actually, let's just make it 1200x800 for a good hero banner. The original is 816x1024.
# We need to crop it to landscape or square? Let's crop it to square 816x816 to preserve quality, or just keep it as is if we want.
# User said "acomodala al tamaño de esa". The original was 640x640. So I will crop the center to square and resize to 640x640.
w, h = img_hero.size
size = min(w, h)
left = (w - size) / 2
top = (h - size) / 2
right = (w + size) / 2
bottom = (h + size) / 2
img_hero_cropped = img_hero.crop((left, top, right, bottom))
img_hero_resized = img_hero_cropped.resize((640, 640), Image.Resampling.LANCZOS)
img_hero_resized.save(hero_dst, quality=95)

# 2. Stickers Galletitas
gall_src = os.path.join(brain, "media__1779660502634.jpg")
gall_dst = os.path.join(pub, "stickers_galletitas.jpg")
shutil.copy2(gall_src, gall_dst)

# 3. Stickers Caritas
car_src = os.path.join(brain, "media__1779660502570.jpg")
car_dst = os.path.join(pub, "stickers_caritas.jpg")
shutil.copy2(car_src, car_dst)

print("Images processed and copied.")
