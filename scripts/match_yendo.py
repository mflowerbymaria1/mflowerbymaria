from PIL import Image
import os

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

def match_yendo_size(filename):
    path = os.path.join(pub, filename)
    if not os.path.exists(path): return
    
    img = Image.open(path).convert("RGB")
    
    # We want the content to be ~80% of the width/height
    scale = 0.8
    new_w = int(img.size[0] * scale)
    new_h = int(img.size[1] * scale)
    
    resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Create white canvas of original size
    new_img = Image.new("RGB", img.size, (255, 255, 255))
    paste_x = (img.size[0] - new_w) // 2
    paste_y = (img.size[1] - new_h) // 2
    new_img.paste(resized, (paste_x, paste_y))
    
    new_img.save(path, quality=95)
    print(f"Matched {filename} to Yendo size")

# First restore from original so we don't double scale
brain_prev = r"C:\Users\Leandro\.gemini\antigravity\brain\ce18a836-6317-4fdf-92fc-6bf9f51a79ef"
brain_curr = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"
import shutil
shutil.copy2(os.path.join(brain_prev, "media__1779654869285.jpg"), os.path.join(pub, "mockup_amelie_front.jpg"))
shutil.copy2(os.path.join(brain_prev, "media__1779654869307.jpg"), os.path.join(pub, "mockup_amelie_back.jpg"))
shutil.copy2(os.path.join(brain_curr, "media__1779656692534.jpg"), os.path.join(pub, "mockup_coffee_time_front.jpg"))

# Then scale
match_yendo_size("mockup_amelie_front.jpg")
match_yendo_size("mockup_amelie_back.jpg")
match_yendo_size("mockup_coffee_time_front.jpg")
