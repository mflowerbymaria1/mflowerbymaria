from PIL import Image
import os

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

def zoom_out(filename, scale_factor=0.85):
    path = os.path.join(pub, filename)
    if not os.path.exists(path):
        return
        
    img = Image.open(path).convert("RGB")
    w, h = img.size
    
    # Create a new white image of the same size
    new_img = Image.new("RGB", (w, h), (255, 255, 255))
    
    # Resize original image to be smaller
    new_w = int(w * scale_factor)
    new_h = int(h * scale_factor)
    resized_img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Paste the resized image into the center of the white canvas
    paste_x = (w - new_w) // 2
    paste_y = (h - new_h) // 2
    new_img.paste(resized_img, (paste_x, paste_y))
    
    new_img.save(path, quality=95)
    print(f"Zoomed out {filename}")

# The user mentioned Amelie and Coffee Time in previous messages as having too much zoom.
zoom_out("mockup_coffee_time_front.jpg", 0.8)
zoom_out("mockup_amelie_front.jpg", 0.8)
zoom_out("mockup_amelie_back.jpg", 0.8)

