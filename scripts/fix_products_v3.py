import os
import shutil
from PIL import Image, ImageChops

brain = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"
brain_prev = r"C:\Users\Leandro\.gemini\antigravity\brain\ce18a836-6317-4fdf-92fc-6bf9f51a79ef"
pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

# 1. Copy Yendo images (cat on toilet)
# Front = "Tarde, Pero yendo!" (discs on left) 
shutil.copy2(os.path.join(brain, "media__1779657865651.jpg"), os.path.join(pub, "mockup_yendo_front.jpg"))
# Back = "REVERSE SIDE" (discs on right)
shutil.copy2(os.path.join(brain, "media__1779657865643.jpg"), os.path.join(pub, "mockup_yendo_back.jpg"))
print("Copied Yendo front + back")

# 2. Copy Candy images (bubblegum cat)
# Front = bubblegum cat (discs on left)
shutil.copy2(os.path.join(brain, "media__1779657892874.jpg"), os.path.join(pub, "mockup_candy_front.jpg"))
# Back = plain pink cover (discs on right) 
shutil.copy2(os.path.join(brain, "media__1779657892833.jpg"), os.path.join(pub, "mockup_candy_back.jpg"))
print("Copied Candy front + back")

# 3. Fix Maleva front - make it match the back image's centering and size
# The back image is the reference (well centered, good size)
# Original maleva front source:
maleva_front_src = os.path.join(brain_prev, "media__1779653408660.jpg")  # 1024x571
maleva_back_src = os.path.join(brain_prev, "media__1779653408692.jpg")   # 1024x571

# Load both originals
front_orig = Image.open(maleva_front_src).convert("RGB")
back_orig = Image.open(maleva_back_src).convert("RGB")

# The back is already at the right size/centering in the product.
# Current back: 1024x768 (we padded it). Let me check what it looks like.
back_current = Image.open(os.path.join(pub, "mockup_maleva_back.jpg")).convert("RGB")

# The back has the fichero nicely centered. Let's find where the object is in the back.
bg_back = Image.new('RGB', back_current.size, (255, 255, 255))
diff_back = ImageChops.difference(back_current, bg_back).convert('L')
mask_back = diff_back.point(lambda p: 255 if p > 20 else 0)
back_bbox = mask_back.getbbox()
print(f"Back bbox: {back_bbox}")  # Should show the centered fichero

# Now find the object in the front original
bg_front = Image.new('RGB', front_orig.size, front_orig.getpixel((0,0)))
diff_front = ImageChops.difference(front_orig, bg_front).convert('L')
mask_front = diff_front.point(lambda p: 255 if p > 20 else 0)
front_bbox = mask_front.getbbox()
print(f"Front original bbox: {front_bbox}")

# Crop the front object
front_obj = front_orig.crop(front_bbox)
front_obj_w, front_obj_h = front_obj.size

# Back object dimensions in current back image
back_obj_w = back_bbox[2] - back_bbox[0]
back_obj_h = back_bbox[3] - back_bbox[1]
back_cx = (back_bbox[0] + back_bbox[2]) // 2
back_cy = (back_bbox[1] + back_bbox[3]) // 2

print(f"Back object: {back_obj_w}x{back_obj_h}, center=({back_cx},{back_cy})")
print(f"Front object: {front_obj_w}x{front_obj_h}")

# Scale front object to match back object size
scale_w = back_obj_w / front_obj_w
scale_h = back_obj_h / front_obj_h
scale = min(scale_w, scale_h)  # Use the smaller scale to fit
new_w = int(front_obj_w * scale)
new_h = int(front_obj_h * scale)

front_obj_resized = front_obj.resize((new_w, new_h), Image.Resampling.LANCZOS)

# Create new image same size as back (1024x768)
new_front = Image.new("RGB", back_current.size, (255, 255, 255))
# Center it at the same position as the back object
paste_x = back_cx - new_w // 2
paste_y = back_cy - new_h // 2
new_front.paste(front_obj_resized, (paste_x, paste_y))

new_front.save(os.path.join(pub, "mockup_maleva_front.jpg"), quality=95)
print(f"Fixed Maleva front: object scaled to {new_w}x{new_h}, centered at ({paste_x},{paste_y})")
