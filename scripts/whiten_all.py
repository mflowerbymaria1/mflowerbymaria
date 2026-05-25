import os
import shutil
from PIL import Image, ImageDraw

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"
brain = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"

# The original sticker files from early in the session
caritas_src = os.path.join(brain, "media__1779657892874.jpg") # Assuming 117KB is caritas, 115KB is galletitas?
galletitas_src = os.path.join(brain, "media__1779657865651.jpg") # I'll copy the largest ones.

shutil.copy2(caritas_src, os.path.join(pub, "stickers_caritas.jpg"))
shutil.copy2(galletitas_src, os.path.join(pub, "stickers_galletitas.jpg"))

def make_bg_white_floodfill(filename, tolerance=25):
    path = os.path.join(pub, filename)
    img = Image.open(path).convert("RGB")
    w, h = img.size
    
    corners = [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1), (w//2, 0), (w//2, h-1), (0, h//2), (w-1, h//2)]
    
    for x, y in corners:
        try:
            ImageDraw.floodfill(img, xy=(x, y), value=(255, 255, 255), thresh=tolerance)
        except Exception as e:
            pass
            
    img.save(path, quality=100, subsampling=0)
    print(f"Whitened {filename}")

# Process them!
make_bg_white_floodfill("stickers_caritas.jpg")
make_bg_white_floodfill("stickers_galletitas.jpg")

# Process the blocks as requested (fondo blanco no gris)
make_bg_white_floodfill("block_papeles_inspiracion_1.jpg", tolerance=20)
make_bg_white_floodfill("block_papeles_inspiracion_2.jpg", tolerance=20)
