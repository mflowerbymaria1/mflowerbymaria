import os
from PIL import Image, ImageDraw

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

def make_bg_white_floodfill(filename, tolerance=45):
    path = os.path.join(pub, filename)
    img = Image.open(path).convert("RGB")
    w, h = img.size
    
    corners = [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1), (w//2, 0), (w//2, h-1), (0, h//2), (w-1, h//2)]
    
    for x, y in corners:
        try:
            ImageDraw.floodfill(img, xy=(x, y), value=(255, 255, 255), thresh=tolerance)
        except Exception as e:
            pass
            
    # Also explicitly force any pixel > 245 to 255 just in case
    pixels = img.load()
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            if r > 245 and g > 245 and b > 245:
                pixels[x, y] = (255, 255, 255)

    img.save(path, quality=100, subsampling=0)
    print(f"Whitened aggressively {filename}")

make_bg_white_floodfill("stickers_caritas.jpg")
make_bg_white_floodfill("stickers_galletitas.jpg")
make_bg_white_floodfill("block_papeles_inspiracion_1.jpg")
make_bg_white_floodfill("block_papeles_inspiracion_2.jpg")
