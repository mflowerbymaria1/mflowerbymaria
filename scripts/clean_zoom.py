from PIL import Image
import os

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

def clean_and_zoom(filename, scale_factor=0.64):
    path = os.path.join(pub, filename)
    if not os.path.exists(path): return
    
    img = Image.open(path).convert("RGB")
    w, h = img.size
    pixels = img.load()
    
    # 1. Clean background: make anything light grey become pure white.
    # We only do this near the edges to avoid messing up the notebook itself.
    # Actually, let's just make the whole image's light pixels white.
    # The notebook might have some white spots, but that's fine.
    for y in range(h):
        for x in range(w):
            r, g, b = pixels[x, y]
            if r > 240 and g > 240 and b > 240:
                pixels[x, y] = (255, 255, 255)
                
    # 2. Smooth the edges of the notebook where it meets the newly white bg? 
    # Not strictly necessary if the original bg was already very light.
    
    # 3. Zoom out
    new_w = int(w * scale_factor)
    new_h = int(h * scale_factor)
    resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    new_img = Image.new("RGB", (w, h), (255, 255, 255))
    paste_x = (w - new_w) // 2
    paste_y = (h - new_h) // 2
    new_img.paste(resized, (paste_x, paste_y))
    
    new_img.save(path, quality=95)
    print(f"Cleaned and zoomed {filename}")

clean_and_zoom("mockup_coffee_time_front.jpg")
clean_and_zoom("mockup_amelie_front.jpg")
clean_and_zoom("mockup_amelie_back.jpg")

