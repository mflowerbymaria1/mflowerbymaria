from PIL import Image, ImageChops
import os

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"
filename = "stickers_galletitas.jpg"
path = os.path.join(pub, filename)

img = Image.open(path).convert("RGB")

def get_bbox_area(image):
    bg = Image.new("RGB", image.size, (255, 255, 255))
    diff = ImageChops.difference(image, bg)
    diff = diff.convert("L").point(lambda p: p > 10 and 255)
    bbox = diff.getbbox()
    if bbox:
        return (bbox[2] - bbox[0]) * (bbox[3] - bbox[1])
    return float('inf')

min_area = float('inf')
best_angle = 0

# Test angles from -30 to 30
for angle in range(-30, 31):
    # Rotate with white background
    rotated = img.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True, fillcolor=(255, 255, 255))
    area = get_bbox_area(rotated)
    if area < min_area:
        min_area = area
        best_angle = angle

print(f"Best angle is {best_angle} degrees")

# Apply the best rotation
final = img.rotate(best_angle, resample=Image.Resampling.BICUBIC, expand=True, fillcolor=(255, 255, 255))

# Crop and center it again
bg = Image.new("RGB", final.size, (255, 255, 255))
diff = ImageChops.difference(final, bg)
diff = diff.convert("L").point(lambda p: p > 10 and 255)
bbox = diff.getbbox()

if bbox:
    cropped = final.crop(bbox)
    cw, ch = cropped.size
    size = int(max(cw, ch) * 1.2)
    new_img = Image.new("RGB", (size, size), (255, 255, 255))
    paste_x = (size - cw) // 2
    paste_y = (size - ch) // 2
    new_img.paste(cropped, (paste_x, paste_y))
    new_img.save(path, quality=95)
    print("Rotated and saved.")
