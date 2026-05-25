from PIL import Image, ImageChops
import os

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

def clean_and_center_sticker(filename):
    path = os.path.join(pub, filename)
    if not os.path.exists(path): return
    
    img = Image.open(path).convert("RGB")
    w, h = img.size
    pixels = img.load()
    
    # 1. Clean background: make light grey/beige become pure white.
    # We use a threshold of 230 to catch any off-white backgrounds.
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            if r > 230 and g > 230 and b > 230:
                pixels[x, y] = (255, 255, 255)
                
    # 2. Find bounding box of the non-white sticker sheet
    bg = Image.new("RGB", (w, h), (255, 255, 255))
    diff = ImageChops.difference(img, bg)
    diff = diff.convert("L").point(lambda p: p > 10 and 255)
    bbox = diff.getbbox()
    
    if bbox:
        # Crop tight to the sticker sheet
        cropped = img.crop(bbox)
        cw, ch = cropped.size
        
        # 3. Create a perfect square canvas (with plenty of margin so it's centered)
        # The user wants it "centra la plancha de stickers"
        size = int(max(cw, ch) * 1.2) # 20% margin
        new_img = Image.new("RGB", (size, size), (255, 255, 255))
        
        paste_x = (size - cw) // 2
        paste_y = (size - ch) // 2
        new_img.paste(cropped, (paste_x, paste_y))
        
        new_img.save(path, quality=95)
        print(f"Cleaned and centered {filename}")
    else:
        print(f"Could not find bounding box for {filename}")

# First, restore original galletitas just in case my previous padding messed it up
brain_curr = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"
import shutil
shutil.copy2(os.path.join(brain_curr, "media__1779660502634.jpg"), os.path.join(pub, "stickers_galletitas.jpg"))
shutil.copy2(os.path.join(brain_curr, "media__1779660502570.jpg"), os.path.join(pub, "stickers_caritas.jpg"))

clean_and_center_sticker("stickers_galletitas.jpg")
clean_and_center_sticker("stickers_caritas.jpg")

