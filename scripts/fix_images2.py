from PIL import Image
import os

brain = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"
pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

# 1. Hero image - Copy original without cropping/downscaling to keep quality
hero_src = os.path.join(brain, "media__1779660502720.jpg")
hero_dst = os.path.join(pub, "mflower_hero_desk_new.jpg")
img_hero = Image.open(hero_src)
img_hero.save(hero_dst, quality=100) # Save at highest quality, full resolution (816x1024)

# 2. Pad stickers to square so they aren't cropped
def pad_to_square(src_name, dst_name):
    path = os.path.join(pub, src_name)
    img = Image.open(path).convert("RGB")
    w, h = img.size
    
    # We want a white square
    size = max(w, h)
    # Add a bit of padding (5%)
    padded_size = int(size * 1.05)
    
    new_img = Image.new("RGB", (padded_size, padded_size), (255, 255, 255))
    
    paste_x = (padded_size - w) // 2
    paste_y = (padded_size - h) // 2
    new_img.paste(img, (paste_x, paste_y))
    
    new_img.save(os.path.join(pub, dst_name), quality=95)
    print(f"Padded {src_name} to {padded_size}x{padded_size}")

pad_to_square("stickers_galletitas.jpg", "stickers_galletitas.jpg")
pad_to_square("stickers_caritas.jpg", "stickers_caritas.jpg")
