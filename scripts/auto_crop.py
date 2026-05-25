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
        margin = 30
        left = max(0, bbox[0] - margin)
        top = max(0, bbox[1] - margin)
        right = min(img.size[0], bbox[2] + margin)
        bottom = min(img.size[1], bbox[3] + margin)
        
        cropped = img.crop((left, top, right, bottom))
        
        # We probably want to make it a square so it doesn't get cut in thumbnails.
        # But wait, if we make it a square, it will be padded again.
        # Let's just save the tight crop. object-fit: contain will handle it in the UI.
        
        cropped.save(path, quality=95)
        print(f"Cropped {filename}")
    else:
        print(f"Could not find bounding box for {filename}")

# Crop the ones that have huge margins
auto_crop("mockup_croissant_front.jpg")
auto_crop("mockup_croissant_back.jpg")
auto_crop("mockup_jirafa_front.jpg")
auto_crop("mockup_jirafa_back.jpg")
auto_crop("mockup_sol_mayo_front.jpg")
auto_crop("mockup_sol_mayo_back.jpg")
