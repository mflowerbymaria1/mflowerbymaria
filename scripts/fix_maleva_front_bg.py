from PIL import Image
import os

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"
path = os.path.join(pub, "mockup_maleva_front.jpg")

img = Image.open(path)
w, h = img.size
for y in range(h):
    for x in range(w):
        r, g, b = img.getpixel((x, y))
        if r > 240 and g > 240 and b > 240:
            img.putpixel((x, y), (255, 255, 255))
            
img.save(path, quality=95)
print("Cleaned Maleva front background to pure white.")
