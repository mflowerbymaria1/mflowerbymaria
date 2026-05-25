import os
from PIL import Image, ImageChops

def make_bg_white(img_path, output_path):
    img = Image.open(img_path).convert("RGB")
    bg_color = img.getpixel((0,0))
    
    pixels = img.load()
    width, height = img.size
    for x in range(width):
        for y in range(height):
            r, g, b = pixels[x, y]
            br, bg, bb = bg_color
            if abs(r - br) < 15 and abs(g - bg) < 15 and abs(b - bb) < 15:
                pixels[x, y] = (255, 255, 255)
                
    img.save(output_path, quality=95)
    print(f"Saved {output_path}")

def pad_to_target(img_path, target_size=(1024, 768)):
    if not os.path.exists(img_path):
        return
    img = Image.open(img_path).convert("RGB")
    
    bg_color = img.getpixel((0,0))
    pixels = img.load()
    width, height = img.size
    for x in range(width):
        for y in range(height):
            r, g, b = pixels[x, y]
            br, bg, bb = bg_color
            if abs(r - br) < 15 and abs(g - bg) < 15 and abs(b - bb) < 15:
                pixels[x, y] = (255, 255, 255)
    
    img.thumbnail(target_size, Image.Resampling.LANCZOS)
    
    new_width, new_height = img.size
    
    final_img = Image.new("RGB", target_size, (255, 255, 255))
    paste_x = (target_size[0] - new_width) // 2
    paste_y = (target_size[1] - new_height) // 2
    
    final_img.paste(img, (paste_x, paste_y))
    final_img.save(img_path, quality=95)
    print(f"Padded {img_path} to {target_size}")

brain_dir = r"C:\Users\Leandro\.gemini\antigravity\brain\ce18a836-6317-4fdf-92fc-6bf9f51a79ef"
make_bg_white(os.path.join(brain_dir, "media__1779654869285.jpg"), r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images\mockup_amelie_front.jpg")
make_bg_white(os.path.join(brain_dir, "media__1779654869307.jpg"), r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images\mockup_amelie_back.jpg")

pad_to_target(r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images\mockup_maleva_front.jpg")
pad_to_target(r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images\mockup_maleva_back.jpg")
