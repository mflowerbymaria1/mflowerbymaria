from PIL import Image, ImageChops, ImageDraw
import os
import shutil

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"
brain_prev = r"C:\Users\Leandro\.gemini\antigravity\brain\ce18a836-6317-4fdf-92fc-6bf9f51a79ef"

# Restore Amelie
shutil.copy2(os.path.join(brain_prev, "media__1779654869285.jpg"), os.path.join(pub, "mockup_amelie_front.jpg"))
shutil.copy2(os.path.join(brain_prev, "media__1779654869307.jpg"), os.path.join(pub, "mockup_amelie_back.jpg"))

def remove_logo_and_crop(filename):
    path = os.path.join(pub, filename)
    img = Image.open(path).convert("RGB")
    w, h = img.size
    
    # Remove logo (Amelie is 1024x1024 originally)
    bg_color = img.getpixel((w-50, h-150))
    draw = ImageDraw.Draw(img)
    draw.rectangle([w-120, h-120, w, h], fill=bg_color)
    
    # Crop
    bg = Image.new("RGB", img.size, (255, 255, 255))
    diff = ImageChops.difference(img, bg).convert("L").point(lambda p: p > 10 and 255)
    bbox = diff.getbbox()
    if bbox:
        margin = 15
        left = max(0, bbox[0] - margin)
        top = max(0, bbox[1] - margin)
        right = min(img.size[0], bbox[2] + margin)
        bottom = min(img.size[1], bbox[3] + margin)
        cropped = img.crop((left, top, right, bottom))
        cropped.save(path, quality=95)
        print(f"Removed logo and cropped {filename}")

remove_logo_and_crop("mockup_amelie_front.jpg")
remove_logo_and_crop("mockup_amelie_back.jpg")

