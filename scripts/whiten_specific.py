import os
from PIL import Image, ImageDraw

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

def make_bg_white_floodfill(filename, tolerance=40):
    path = os.path.join(pub, filename)
    if not os.path.exists(path):
        print(f"Skipping {filename}, not found")
        return
        
    img = Image.open(path).convert("RGB")
    w, h = img.size
    
    corners = [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1), (w//2, 0), (w//2, h-1), (0, h//2), (w-1, h//2)]
    
    for x, y in corners:
        try:
            ImageDraw.floodfill(img, xy=(x, y), value=(255, 255, 255), thresh=tolerance)
        except Exception as e:
            pass
            
    # Also explicitly force any pixel > 240 to 255 to remove any faint recuadro
    pixels = img.load()
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            # typical off-white backgrounds are around 240-250
            if r > 240 and g > 240 and b > 240:
                # check if they are grayish (R,G,B are similar)
                if abs(r-g) < 10 and abs(r-b) < 10:
                    pixels[x, y] = (255, 255, 255)

    img.save(path, quality=100, subsampling=0)
    print(f"Whitened aggressively {filename}")

# Process Sol de Mayo and Maleva
make_bg_white_floodfill("mockup_sol_de_mayo_front.jpg")
make_bg_white_floodfill("mockup_sol_de_mayo_back.jpg")
make_bg_white_floodfill("mockup_maleva_front.jpg")
make_bg_white_floodfill("mockup_maleva_back.jpg")
