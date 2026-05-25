import os
import shutil
from PIL import Image

def restore_exact(src, dst):
    shutil.copy2(src, dst)
    print(f"Restored {dst}")

def center_maleva(src, dst):
    img = Image.open(src).convert("RGB")
    # Original is 1024x571
    new_img = Image.new("RGB", (1024, 768), (255, 255, 255))
    
    paste_x = (1024 - img.width) // 2
    paste_y = (768 - img.height) // 2
    new_img.paste(img, (paste_x, paste_y))
    new_img.save(dst, quality=95)
    print(f"Centered Maleva to {dst}")

brain_prev = r"C:\Users\Leandro\.gemini\antigravity\brain\ce18a836-6317-4fdf-92fc-6bf9f51a79ef"
brain_curr = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"

# 1. Restore Amelie exactly as original
restore_exact(os.path.join(brain_prev, "media__1779654869285.jpg"), "public/images/mockup_amelie_front.jpg")
restore_exact(os.path.join(brain_prev, "media__1779654869307.jpg"), "public/images/mockup_amelie_back.jpg")

# 2. Restore Coffee Time exactly as original
restore_exact(os.path.join(brain_curr, "media__1779656692534.jpg"), "public/images/mockup_coffee_time_front.jpg")

# 3. Center Maleva exactly as original (1024x571) onto 1024x768
center_maleva(os.path.join(brain_prev, "media__1779653408660.jpg"), "public/images/mockup_maleva_front.jpg")
center_maleva(os.path.join(brain_prev, "media__1779653408692.jpg"), "public/images/mockup_maleva_back.jpg")
