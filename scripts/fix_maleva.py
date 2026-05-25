import os
from PIL import Image, ImageChops

def get_bbox(img, bg_color):
    bg = Image.new("RGB", img.size, bg_color)
    diff = ImageChops.difference(img, bg)
    diff = diff.convert("L")
    mask = diff.point(lambda p: 255 if p > 15 else 0)
    return mask.getbbox()

def match_framing(front_path, back_path):
    front = Image.open(front_path).convert("RGB")
    back = Image.open(back_path).convert("RGB")
    
    # Assuming back is already perfectly sized and centered (1024x768)
    back_bg = back.getpixel((0,0))
    back_bbox = get_bbox(back, back_bg)
    if not back_bbox:
        print("Could not find back bbox")
        return
        
    back_w = back_bbox[2] - back_bbox[0]
    back_h = back_bbox[3] - back_bbox[1]
    
    front_bg = front.getpixel((0,0))
    front_bbox = get_bbox(front, front_bg)
    if not front_bbox:
        print("Could not find front bbox")
        return
        
    front_obj = front.crop(front_bbox)
    
    # We want front_obj to have similar height as back_obj
    scale = back_h / float(front_bbox[3] - front_bbox[1])
    new_size = (int((front_bbox[2] - front_bbox[0]) * scale), back_h)
    
    front_obj = front_obj.resize(new_size, Image.Resampling.LANCZOS)
    
    # Create new 1024x768 image
    final_img = Image.new("RGB", (1024, 768), (255, 255, 255))
    
    # Center it exactly where the back object is centered
    back_cx = (back_bbox[0] + back_bbox[2]) // 2
    back_cy = (back_bbox[1] + back_bbox[3]) // 2
    
    paste_x = back_cx - new_size[0] // 2
    paste_y = back_cy - new_size[1] // 2
    
    final_img.paste(front_obj, (paste_x, paste_y))
    final_img.save(front_path, quality=95)
    print("Fixed Maleva front framing to match back.")

# I need the original front. But I already padded it to 1024x768 in the previous step.
# Wait, the previous step just took the original and placed it inside 1024x768, so the object is intact.
# I can still extract the bbox from the current front!
match_framing("public/images/mockup_maleva_front.jpg", "public/images/mockup_maleva_back.jpg")
