import os
from PIL import Image, ImageChops

brain_prev = r"C:\Users\Leandro\.gemini\antigravity\brain\ce18a836-6317-4fdf-92fc-6bf9f51a79ef"
pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

# Load back (reference) - already correctly placed at 1024x768
back = Image.open(os.path.join(pub, "mockup_maleva_back.jpg")).convert("RGB")

# Find the back fichero object bbox
bg = Image.new('RGB', back.size, (255, 255, 255))
diff = ImageChops.difference(back, bg).convert('L')
mask = diff.point(lambda p: 255 if p > 20 else 0)
back_bbox = mask.getbbox()
print(f"Back fichero bbox: {back_bbox}")
back_obj_w = back_bbox[2] - back_bbox[0]
back_obj_h = back_bbox[3] - back_bbox[1]
back_cx = (back_bbox[0] + back_bbox[2]) // 2
back_cy = (back_bbox[1] + back_bbox[3]) // 2
print(f"Back obj size: {back_obj_w}x{back_obj_h}, center: ({back_cx}, {back_cy})")

# Load front original
front_orig = Image.open(os.path.join(brain_prev, "media__1779653408660.jpg")).convert("RGB")
print(f"Front original size: {front_orig.size}")

# The front original has a star watermark at bottom-right. 
# The fichero itself is in the upper-left portion.
# Let's use the back as a reference: the fichero (without discs) spans roughly 620 pixels wide in back.
# The discs on the left in the front extend about 30px before the fichero body starts.

# Find the fichero in the front - but ignore the star
# The star is small and at the bottom right. Let's crop the bottom-right corner before detection.
front_cropped = front_orig.copy()
# Paint over the star area (bottom-right corner) with background color
bg_color = front_orig.getpixel((front_orig.width-1, 0))
for x in range(front_orig.width - 120, front_orig.width):
    for y in range(front_orig.height - 80, front_orig.height):
        front_cropped.putpixel((x, y), bg_color)

# Now find bbox of front fichero
bg_f = Image.new('RGB', front_cropped.size, bg_color)
diff_f = ImageChops.difference(front_cropped, bg_f).convert('L')
mask_f = diff_f.point(lambda p: 255 if p > 20 else 0)
front_bbox = mask_f.getbbox()
print(f"Front fichero bbox (star removed): {front_bbox}")

# Crop the fichero from the ORIGINAL (clean) image using this bbox
front_obj = front_orig.crop(front_bbox)
front_obj_w, front_obj_h = front_obj.size
print(f"Front obj size: {front_obj_w}x{front_obj_h}")

# Scale front object to have the SAME height as back object
scale = back_obj_h / front_obj_h
new_w = int(front_obj_w * scale)
new_h = int(front_obj_h * scale)
print(f"Scaled to: {new_w}x{new_h}")

front_obj_resized = front_obj.resize((new_w, new_h), Image.Resampling.LANCZOS)

# Create 1024x768 white canvas and paste centered at the same vertical position as back
new_front = Image.new("RGB", (1024, 768), (255, 255, 255))
paste_x = (1024 - new_w) // 2  # horizontally centered
paste_y = back_cy - new_h // 2  # vertically matching back
new_front.paste(front_obj_resized, (paste_x, paste_y))

new_front.save(os.path.join(pub, "mockup_maleva_front.jpg"), quality=95)
print(f"Fixed Maleva front: {new_w}x{new_h}, pasted at ({paste_x},{paste_y})")
