import os
from PIL import Image

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"
front = Image.open(os.path.join(pub, "mockup_amelie_front.jpg"))
back = Image.open(os.path.join(pub, "mockup_amelie_back.jpg"))

print(f"Amelie front size: {front.size}")
print(f"Amelie back size: {back.size}")

# Let's crop out a 60x60 square from the bottom right to see if there's a watermark
def inspect_corner(img, name):
    w, h = img.size
    print(f"\n{name} bottom-right corner pixels:")
    for y in range(h-10, h):
        row = []
        for x in range(w-20, w):
            row.append(img.getpixel((x, y)))
        # Just check if there's significant variation indicating a logo
        bg = img.getpixel((w-1, h-1))
        has_logo = any(abs(p[0]-bg[0]) > 20 or abs(p[1]-bg[1]) > 20 or abs(p[2]-bg[2]) > 20 for p in row)
        print(f"  y={y}: has_logo={has_logo}")

inspect_corner(front, "Front")
inspect_corner(back, "Back")
