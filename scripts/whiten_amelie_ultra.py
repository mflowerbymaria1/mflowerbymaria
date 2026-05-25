import os
import shutil
from PIL import Image, ImageDraw

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"
brain = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"

img1_src = os.path.join(brain, "media__1779674960380.jpg")
img2_src = os.path.join(brain, "media__1779674960390.jpg")

shutil.copy2(img1_src, os.path.join(pub, "mockup_amelie_front.jpg"))
shutil.copy2(img2_src, os.path.join(pub, "mockup_amelie_back.jpg"))

def make_bg_white_floodfill_ultra_safe(filename, tolerance=15):
    path = os.path.join(pub, filename)
    img = Image.open(path).convert("RGB")
    w, h = img.size
    
    # Only flood fill the very corners to be ultra safe and not touch the notebook
    corners = [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1)]
    
    for x, y in corners:
        try:
            ImageDraw.floodfill(img, xy=(x, y), value=(255, 255, 255), thresh=tolerance)
        except Exception as e:
            pass

    # Add a 10% white padding so it's centered like the others, without scaling the notebook itself
    pad = int(w * 0.1)
    new_w = w + pad * 2
    new_h = h + pad * 2
    padded_img = Image.new("RGB", (new_w, new_h), (255, 255, 255))
    padded_img.paste(img, (pad, pad))

    padded_img.save(path, quality=100, subsampling=0)
    print(f"Whitened safely and padded {filename}")

make_bg_white_floodfill_ultra_safe("mockup_amelie_front.jpg")
make_bg_white_floodfill_ultra_safe("mockup_amelie_back.jpg")
