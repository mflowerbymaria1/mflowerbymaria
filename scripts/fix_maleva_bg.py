from PIL import Image, ImageDraw

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"
path = pub + r"\mockup_maleva_back.jpg"

img = Image.open(path).convert("RGB")
w, h = img.size

# We want to make the background perfectly white to avoid any "gray rectangles"
# The image has a slight off-white background.
# We can flood fill the background with pure white (255, 255, 255)
# Or we can just copy the black and white pattern and the discs onto a pure white background.

# Let's just create a new pure white image and paste the core elements
# Or even simpler: threshold the background to white.
for y in range(h):
    for x in range(w):
        r, g, b = img.getpixel((x, y))
        # If it's close to white (the gray background the user complained about)
        if r > 240 and g > 240 and b > 240:
            img.putpixel((x, y), (255, 255, 255))
            
img.save(path, quality=95)
print("Maleva back background made pure white")
