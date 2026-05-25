import os
from PIL import Image, ImageChops

def pad_image_zoom_out_from_source(src_path, dst_path, pad_percent=0.30):
    if not os.path.exists(src_path):
        print(f"Not found: {src_path}")
        return
    img = Image.open(src_path).convert("RGB")
    w, h = img.size
    
    new_w = int(w * (1 + pad_percent * 2))
    new_h = int(h * (1 + pad_percent * 2))
    
    new_img = Image.new("RGB", (new_w, new_h), (255, 255, 255))
    paste_x = int(w * pad_percent)
    paste_y = int(h * pad_percent)
    new_img.paste(img, (paste_x, paste_y))
    
    # Scale back to original size
    new_img = new_img.resize((w, h), Image.Resampling.LANCZOS)
    new_img.save(dst_path, quality=95)
    print(f"Zoomed out {dst_path}")

def force_center_maleva_larger(front_src_path, back_path, dst_path):
    back = Image.open(back_path).convert("RGB")
    front = Image.open(front_src_path).convert("RGB")
    
    bg = Image.new('RGB', front.size, (255, 255, 255))
    diff = ImageChops.difference(front, bg).convert('L')
    mask = diff.point(lambda p: 255 if p > 15 else 0)
    bbox = mask.getbbox()
    
    if not bbox:
        return
        
    front_obj = front.crop(bbox)
    
    # Back is 1024x768
    # Let's check back bbox again just in case
    bg_back = Image.new('RGB', back.size, (255, 255, 255))
    diff_back = ImageChops.difference(back, bg_back).convert('L')
    mask_back = diff_back.point(lambda p: 255 if p > 15 else 0)
    back_bbox = mask_back.getbbox()
    back_h = back_bbox[3] - back_bbox[1] if back_bbox else 352
    
    obj_w = bbox[2] - bbox[0]
    obj_h = bbox[3] - bbox[1]
    
    # Before I scaled to 0.85, now I will scale to 1.0 (same height as back) or even slightly larger
    # Actually if they say it's small, let's scale it so it fills more height.
    # What if I scale the height to 500?
    scale = 500 / float(obj_h)
    new_size = (int(obj_w * scale), int(obj_h * scale))
    front_obj = front_obj.resize(new_size, Image.Resampling.LANCZOS)
    
    new_img = Image.new("RGB", (1024, 768), (255, 255, 255))
    paste_x = (1024 - new_size[0]) // 2
    paste_y = (768 - new_size[1]) // 2
    new_img.paste(front_obj, (paste_x, paste_y))
    new_img.save(dst_path, quality=95)
    print(f"Forced center LARGER and resized {dst_path}")

brain_dir = r"C:\Users\Leandro\.gemini\antigravity\brain\ce18a836-6317-4fdf-92fc-6bf9f51a79ef"
brain_curr = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"

pad_image_zoom_out_from_source(os.path.join(brain_dir, "media__1779654869285.jpg"), "public/images/mockup_amelie_front.jpg", 0.35)
pad_image_zoom_out_from_source(os.path.join(brain_dir, "media__1779654869307.jpg"), "public/images/mockup_amelie_back.jpg", 0.35)

pad_image_zoom_out_from_source(os.path.join(brain_curr, "media__1779656692534.jpg"), "public/images/mockup_coffee_time_front.jpg", 0.35)

# For Maleva, I need original. Is original available? It was 1066x677 initially.
# Let's try to find original Maleva front if it exists, or just enlarge the current one.
# Current one might be lower res, but it's 1024x768 and we can enlarge the object in it.
force_center_maleva_larger("public/images/mockup_maleva_front.jpg", "public/images/mockup_maleva_back.jpg", "public/images/mockup_maleva_front.jpg")

