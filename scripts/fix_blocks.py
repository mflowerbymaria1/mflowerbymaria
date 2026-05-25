from PIL import Image, ImageChops, ImageDraw
import os

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

def remove_logo_clean_center(filename):
    path = os.path.join(pub, filename)
    if not os.path.exists(path): return
    
    img = Image.open(path).convert("RGB")
    w, h = img.size
    
    # 1. Remove Gemini logo (bottom right)
    bg_color = img.getpixel((w-50, h-150))
    draw = ImageDraw.Draw(img)
    draw.rectangle([w-120, h-120, w, h], fill=bg_color)
    
    # 2. Clean light-grey backgrounds to white
    pixels = img.load()
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            if r > 230 and g > 230 and b > 230:
                pixels[x, y] = (255, 255, 255)
                
    # 3. Find bounding box to crop tightly first
    bg = Image.new("RGB", (w, h), (255, 255, 255))
    diff = ImageChops.difference(img, bg).convert("L").point(lambda p: p > 20 and 255)
    bbox = diff.getbbox()
    
    if bbox:
        cropped = img.crop(bbox)
        cw, ch = cropped.size
        
        # 4. Paste onto a square canvas to prevent cropping in thumbnails
        # Make the square size 5% larger than the max dimension for a small nice margin
        size = int(max(cw, ch) * 1.05)
        new_img = Image.new("RGB", (size, size), (255, 255, 255))
        paste_x = (size - cw) // 2
        paste_y = (size - ch) // 2
        new_img.paste(cropped, (paste_x, paste_y))
        
        new_img.save(path, quality=95)
        print(f"Processed {filename}")

# Process the new images
remove_logo_clean_center("block_papeles_inspiracion_1.jpg")
remove_logo_clean_center("block_papeles_inspiracion_2.jpg")
remove_logo_clean_center("block_hojas_osito.jpg")
remove_logo_clean_center("block_hojas_cerezas.jpg")
