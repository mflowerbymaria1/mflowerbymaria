import os
from PIL import Image, ImageDraw

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

def make_bg_white_floodfill(filename, tolerance=25):
    path = os.path.join(pub, filename)
    img = Image.open(path).convert("RGB")
    w, h = img.size
    
    # We will use floodfill on the 4 corners
    corners = [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1), (w//2, 0), (w//2, h-1), (0, h//2), (w-1, h//2)]
    
    for x, y in corners:
        try:
            ImageDraw.floodfill(img, xy=(x, y), value=(255, 255, 255), thresh=tolerance)
        except Exception as e:
            print("Error filling corner:", e)
            
    # Also if the user wants no Gemini logo, we can remove it first
    # Gemini logo is usually bottom right.
    draw = ImageDraw.Draw(img)
    bg_color = img.getpixel((w-50, h-150))
    # Overwrite logo area
    draw.rectangle([w-120, h-120, w, h], fill=bg_color)
    
    # Try flood fill again after removing logo just in case
    ImageDraw.floodfill(img, xy=(w-1, h-1), value=(255, 255, 255), thresh=tolerance)

    img.save(path, quality=100, subsampling=0)
    print(f"Whitened background for {filename}")

# Process the blocks
make_bg_white_floodfill("block_papeles_inspiracion_1.jpg")
make_bg_white_floodfill("block_papeles_inspiracion_2.jpg")

# Process the stickers (caritas and galletitas)
# Wait, I need to find the ORIGINAL stickers first, because the current stickers_caritas.jpg is "fea" (ruined by my old script).
