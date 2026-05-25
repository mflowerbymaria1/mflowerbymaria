import shutil
import os
from PIL import Image, ImageChops

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"
brain = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"

# The 4 newest files
files = [
    ("media__1779672430147.jpg", "block_papeles_inspiracion_1.jpg"), # text
    ("media__1779672430024.jpg", "block_papeles_inspiracion_2.jpg"), # collage
    ("media__1779672430134.jpg", "block_hojas_osito.jpg"),
    ("media__1779672430108.jpg", "block_hojas_cerezas.jpg")
]

for src, dst in files:
    src_path = os.path.join(brain, src)
    dst_path = os.path.join(pub, dst)
    shutil.copy2(src_path, dst_path)

def process_image(filename):
    path = os.path.join(pub, filename)
    img = Image.open(path).convert("RGB")
    w, h = img.size
    
    pixels = img.load()
    # Clean background
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            if r > 230 and g > 230 and b > 230:
                pixels[x, y] = (255, 255, 255)
                
    bg = Image.new("RGB", (w, h), (255, 255, 255))
    diff = ImageChops.difference(img, bg).convert("L").point(lambda p: p > 20 and 255)
    bbox = diff.getbbox()
    
    if bbox:
        cropped = img.crop(bbox)
        cw, ch = cropped.size
        
        # Make a perfectly square canvas with 10% padding
        size = int(max(cw, ch) * 1.10)
        new_img = Image.new("RGB", (size, size), (255, 255, 255))
        
        paste_x = (size - cw) // 2
        paste_y = (size - ch) // 2
        new_img.paste(cropped, (paste_x, paste_y))
        
        new_img.save(path, quality=95)
        print(f"Processed {filename}")
    else:
        # Just pad the original
        size = int(max(w, h) * 1.10)
        new_img = Image.new("RGB", (size, size), (255, 255, 255))
        new_img.paste(img, ((size-w)//2, (size-h)//2))
        new_img.save(path, quality=95)
        print(f"Padded {filename}")

for _, dst in files:
    process_image(dst)
