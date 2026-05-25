from PIL import Image
import os

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

def pad_to_square_with_margin(src_name, margin_factor=0.8):
    path = os.path.join(pub, src_name)
    if not os.path.exists(path): return
    
    img = Image.open(path).convert("RGB")
    w, h = img.size
    
    # We want a white square
    size = max(w, h)
    padded_size = int(size / margin_factor)
    
    new_img = Image.new("RGB", (padded_size, padded_size), (255, 255, 255))
    
    paste_x = (padded_size - w) // 2
    paste_y = (padded_size - h) // 2
    new_img.paste(img, (paste_x, paste_y))
    
    new_img.save(path, quality=95)
    print(f"Padded {src_name} with margin")

# Actually, the original images were already padded to square by fix_images2.py
# So doing it again on the already padded image will just add more white margin.
# Let's restore from original first to be clean.
brain = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"
gall_src = os.path.join(brain, "media__1779660502634.jpg")
car_src = os.path.join(brain, "media__1779660502570.jpg")

import shutil
shutil.copy2(gall_src, os.path.join(pub, "stickers_galletitas.jpg"))
shutil.copy2(car_src, os.path.join(pub, "stickers_caritas.jpg"))

pad_to_square_with_margin("stickers_galletitas.jpg", 0.8)
pad_to_square_with_margin("stickers_caritas.jpg", 0.8)

