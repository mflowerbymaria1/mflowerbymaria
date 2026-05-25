from PIL import Image, ImageChops
import os

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

def auto_crop(filename):
    path = os.path.join(pub, filename)
    if not os.path.exists(path): return
    
    img = Image.open(path).convert("RGB")
    
    # Create white image of same size
    bg = Image.new("RGB", img.size, (255, 255, 255))
    
    # Get bounding box of difference (non-white pixels)
    # We use a threshold because JPG compression might leave near-white artifacts
    diff = ImageChops.difference(img, bg)
    
    # Convert difference to grayscale to easily find non-white
    diff = diff.convert("L")
    
    # Threshold: anything with > 10 difference is part of the object
    diff = diff.point(lambda p: p > 10 and 255)
    
    bbox = diff.getbbox()
    if bbox:
        # Crop to bbox with a tiny margin
        margin = 15 # Smaller margin to make it closer
        left = max(0, bbox[0] - margin)
        top = max(0, bbox[1] - margin)
        right = min(img.size[0], bbox[2] + margin)
        bottom = min(img.size[1], bbox[3] + margin)
        
        cropped = img.crop((left, top, right, bottom))
        
        cropped.save(path, quality=95)
        print(f"Cropped {filename}")
    else:
        print(f"Could not find bounding box for {filename}")

# First restore from original to ensure we don't crop an already padded one
brain_prev = r"C:\Users\Leandro\.gemini\antigravity\brain\ce18a836-6317-4fdf-92fc-6bf9f51a79ef"
brain_curr = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"
import shutil
shutil.copy2(os.path.join(brain_prev, "media__1779654869285.jpg"), os.path.join(pub, "mockup_amelie_front.jpg"))
shutil.copy2(os.path.join(brain_prev, "media__1779654869307.jpg"), os.path.join(pub, "mockup_amelie_back.jpg"))
shutil.copy2(os.path.join(brain_curr, "media__1779656692534.jpg"), os.path.join(pub, "mockup_coffee_time_front.jpg"))

auto_crop("mockup_amelie_front.jpg")
auto_crop("mockup_amelie_back.jpg")
auto_crop("mockup_coffee_time_front.jpg")

# Re-run for Yendo, Candy, Salchicha, Maleva, Pretty Girls so EVERYTHING is perfectly tight and uniform!
auto_crop("mockup_yendo_front.jpg")
auto_crop("mockup_yendo_back.jpg")
auto_crop("mockup_candy_front.jpg")
auto_crop("mockup_candy_back.jpg")
auto_crop("mockup_salchicha_front.jpg")
auto_crop("mockup_salchicha_back.jpg")
auto_crop("mockup_maleva_front.jpg")
auto_crop("mockup_maleva_back.jpg")
auto_crop("mockup_pretty_girls_front.jpg")
auto_crop("mockup_pretty_girls_back.jpg")
