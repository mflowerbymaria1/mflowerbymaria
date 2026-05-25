import os
import shutil
from PIL import Image, ImageDraw

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"
brain = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"

# Restore the TRUE original sticker files
galletitas_src = os.path.join(brain, "media__1779660502634.jpg")
caritas_src = os.path.join(brain, "media__1779660502570.jpg")

shutil.copy2(caritas_src, os.path.join(pub, "stickers_caritas.jpg"))
shutil.copy2(galletitas_src, os.path.join(pub, "stickers_galletitas.jpg"))

def gentle_whiten_and_center(filename, is_galletitas=False):
    path = os.path.join(pub, filename)
    img = Image.open(path).convert("RGB")
    
    if is_galletitas:
        img = img.rotate(2, resample=Image.Resampling.BICUBIC, expand=True, fillcolor=(255, 255, 255))
        
    w, h = img.size
    
    # Very gentle whitening
    pixels = img.load()
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            # Only whiten pixels that are clearly greyish background, not the sticker contents
            if r > 230 and g > 230 and b > 230:
                pixels[x, y] = (255, 255, 255)
    
    img.save(path, quality=100, subsampling=0)
    print(f"Restored and gentled {filename}")

gentle_whiten_and_center("stickers_caritas.jpg")
gentle_whiten_and_center("stickers_galletitas.jpg", is_galletitas=True)
