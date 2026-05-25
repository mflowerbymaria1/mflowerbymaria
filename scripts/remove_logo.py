from PIL import Image, ImageDraw
import os

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

def remove_logo(filename):
    path = os.path.join(pub, filename)
    if not os.path.exists(path): return
    
    img = Image.open(path).convert("RGB")
    w, h = img.size
    
    # We sample a background color slightly above the logo
    # For a 1024x1024 image, the logo is at the bottom right.
    # Let's sample from (w-50, h-150)
    bg_color = img.getpixel((w-50, h-150))
    
    draw = ImageDraw.Draw(img)
    # Draw a rectangle over the logo area
    draw.rectangle([w-120, h-120, w, h], fill=bg_color)
    
    img.save(path, quality=100)
    print(f"Removed logo from {filename}")

remove_logo("mockup_amelie_front.jpg")
remove_logo("mockup_amelie_back.jpg")
