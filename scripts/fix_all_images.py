import os
from PIL import Image, ImageChops

def pad_image_zoom_out(img_path, pad_percent=0.15):
    if not os.path.exists(img_path):
        return
    img = Image.open(img_path).convert("RGB")
    w, h = img.size
    
    # We want the original image to take up (1 - pad_percent*2) of the new size
    # Or simply create a new canvas that is larger
    new_w = int(w * (1 + pad_percent * 2))
    new_h = int(h * (1 + pad_percent * 2))
    
    new_img = Image.new("RGB", (new_w, new_h), (255, 255, 255))
    paste_x = int(w * pad_percent)
    paste_y = int(h * pad_percent)
    new_img.paste(img, (paste_x, paste_y))
    
    # Scale back to original size so resolution doesn't explode
    new_img = new_img.resize((w, h), Image.Resampling.LANCZOS)
    new_img.save(img_path, quality=95)
    print(f"Zoomed out {img_path}")

def force_center_maleva(front_path, back_path):
    # The back is the reference
    back = Image.open(back_path).convert("RGB")
    front = Image.open(front_path).convert("RGB")
    
    # Let's crop front tightly to its object
    bg = Image.new('RGB', front.size, (255, 255, 255))
    diff = ImageChops.difference(front, bg).convert('L')
    mask = diff.point(lambda p: 255 if p > 15 else 0)
    bbox = mask.getbbox()
    
    if not bbox:
        return
        
    front_obj = front.crop(bbox)
    
    # Back is 1024x768. The object in back is 607x352.
    # Let's resize front object so its width is exactly 607 (or max height 352)
    # Actually, they want it to LOOK like the second image. The second image has a specific margin.
    obj_w = bbox[2] - bbox[0]
    obj_h = bbox[3] - bbox[1]
    
    # Scale front object down slightly (e.g. 0.85) to make it look smaller/centered
    scale = 0.85 
    new_size = (int(obj_w * scale), int(obj_h * scale))
    front_obj = front_obj.resize(new_size, Image.Resampling.LANCZOS)
    
    new_img = Image.new("RGB", (1024, 768), (255, 255, 255))
    paste_x = (1024 - new_size[0]) // 2
    paste_y = (768 - new_size[1]) // 2
    new_img.paste(front_obj, (paste_x, paste_y))
    new_img.save(front_path, quality=95)
    print(f"Forced center and resized {front_path}")

pad_image_zoom_out("public/images/mockup_amelie_front.jpg", 0.15)
pad_image_zoom_out("public/images/mockup_amelie_back.jpg", 0.15)
pad_image_zoom_out("public/images/mockup_coffee_time_front.jpg", 0.15)

force_center_maleva("public/images/mockup_maleva_front.jpg", "public/images/mockup_maleva_back.jpg")

