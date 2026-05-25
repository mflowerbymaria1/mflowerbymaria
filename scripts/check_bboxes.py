from PIL import Image, ImageChops
import os

def get_bbox(path):
    if not os.path.exists(path): return None
    img = Image.open(path).convert("RGB")
    bg = Image.new("RGB", img.size, (255, 255, 255))
    diff = ImageChops.difference(img, bg)
    diff = diff.convert("L").point(lambda p: p > 10 and 255)
    return diff.getbbox(), img.size

print("coffee:", get_bbox(r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images\mockup_coffee_time_front.jpg"))
print("yendo:", get_bbox(r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images\mockup_yendo_front.jpg"))
print("amelie:", get_bbox(r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images\mockup_amelie_front.jpg"))
