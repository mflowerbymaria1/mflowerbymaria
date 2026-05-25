from PIL import Image, ImageChops
import os

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

def clean_and_center_sticker_v2(filename):
    path = os.path.join(pub, filename)
    if not os.path.exists(path): return
    
    img = Image.open(path).convert("RGB")
    w, h = img.size
    
    # 1. Crop 30 pixels off the edges to remove any weird grey borders from generation
    img = img.crop((30, 30, w-30, h-30))
    w, h = img.size
    
    pixels = img.load()
    
    # 2. Clean background: make light grey/beige become pure white.
    # Use a lower threshold (e.g. 210) to catch darker shadows.
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            if r > 210 and g > 210 and b > 210:
                pixels[x, y] = (255, 255, 255)
                
    # 3. Find bounding box of the non-white sticker sheet
    bg = Image.new("RGB", (w, h), (255, 255, 255))
    diff = ImageChops.difference(img, bg)
    diff = diff.convert("L").point(lambda p: p > 20 and 255)
    bbox = diff.getbbox()
    
    if bbox:
        cropped = img.crop(bbox)
        cw, ch = cropped.size
        
        # 4. Create a perfect square canvas (with plenty of margin so it's centered)
        # The user wants it "centrala mas", so I'll add a 30% margin.
        size = int(max(cw, ch) * 1.3)
        new_img = Image.new("RGB", (size, size), (255, 255, 255))
        
        paste_x = (size - cw) // 2
        paste_y = (size - ch) // 2
        new_img.paste(cropped, (paste_x, paste_y))
        
        new_img.save(path, quality=95)
        print(f"Cleaned and centered {filename}")
    else:
        print(f"Could not find bounding box for {filename}")

# First, restore original stickers
brain_curr = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"
import shutil
shutil.copy2(os.path.join(brain_curr, "media__1779660502634.jpg"), os.path.join(pub, "stickers_galletitas.jpg"))
shutil.copy2(os.path.join(brain_curr, "media__1779660502570.jpg"), os.path.join(pub, "stickers_caritas.jpg"))

# Then rotate galletitas again
def rotate_galletitas():
    img = Image.open(os.path.join(pub, "stickers_galletitas.jpg")).convert("RGB")
    final = img.rotate(2, resample=Image.Resampling.BICUBIC, expand=True, fillcolor=(255, 255, 255))
    final.save(os.path.join(pub, "stickers_galletitas.jpg"), quality=100)

rotate_galletitas()

# Then clean and center
clean_and_center_sticker_v2("stickers_galletitas.jpg")
clean_and_center_sticker_v2("stickers_caritas.jpg")

