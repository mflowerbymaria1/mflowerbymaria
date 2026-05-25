import os
import shutil
from PIL import Image, ImageDraw

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"
brain = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"

img1_src = os.path.join(brain, "media__1779674507591.jpg")
img2_src = os.path.join(brain, "media__1779674507654.jpg")

shutil.copy2(img1_src, os.path.join(pub, "mockup_amelie_front.jpg"))
shutil.copy2(img2_src, os.path.join(pub, "mockup_amelie_back.jpg"))

def make_bg_white_floodfill_only(filename, tolerance=40):
    path = os.path.join(pub, filename)
    img = Image.open(path).convert("RGB")
    w, h = img.size
    
    corners = [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1), (w//2, 0), (w//2, h-1), (0, h//2), (w-1, h//2)]
    
    for x, y in corners:
        try:
            ImageDraw.floodfill(img, xy=(x, y), value=(255, 255, 255), thresh=tolerance)
        except Exception as e:
            pass

    # No aggressive internal pixel replacement! Keep the notebook shading intact!
    img.save(path, quality=100, subsampling=0)
    print(f"Whitened safely {filename}")

make_bg_white_floodfill_only("mockup_amelie_front.jpg")
make_bg_white_floodfill_only("mockup_amelie_back.jpg")
