from PIL import Image
import os

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

# 1. Flip maleva front to create maleva back
front = Image.open(os.path.join(pub, "mockup_maleva_front.jpg"))
back = front.transpose(Image.FLIP_LEFT_RIGHT)

# For a perfect white background, let's also fill the background with pure white.
# We know the object is roughly in the center.
# Actually the front image from fix_maleva_final.py was pasted on a pure white (255, 255, 255) background.
# Wait, looking at the view_file of mockup_maleva_front.jpg, the background has some gray shading on the left side (from the original photo).
# Let's clean the background of the back image by flood filling from the corners.
# Since we flipped it, the gray shading is now on the right side.

# Let's do a simple threshold for the background.
# Anything very close to white, we make pure white.
w, h = back.size
for y in range(h):
    for x in range(w):
        r, g, b = back.getpixel((x, y))
        if r > 240 and g > 240 and b > 240:
            back.putpixel((x, y), (255, 255, 255))

back.save(os.path.join(pub, "mockup_maleva_back.jpg"), quality=95)
print("Created Maleva back by flipping front and cleaning background.")
