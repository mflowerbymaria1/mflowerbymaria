from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
import numpy as np
import os

# Paths
base_dir = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"
drawing_path = r"C:\Users\Leandro\.gemini\antigravity\brain\d9215158-7aa4-46a9-8d2c-141c4d39e290\media__1778889372816.jpg"
out_front = os.path.join(base_dir, "mockup_a4_argentina_front.png")
out_back = os.path.join(base_dir, "mockup_a4_argentina_back.png")
template_ring = os.path.join(base_dir, "debug_disc_template.png")

# 1. Prepare Drawing
drawing = Image.open(drawing_path).convert("RGBA")

# Resize drawing to fit notebook face
nb_width, nb_height = 680, 900
drawing_resized = drawing.resize((nb_width, nb_height), Image.LANCZOS)

# Create a glossy overlay
gloss = Image.new("RGBA", (nb_width, nb_height), (255, 255, 255, 0))
draw_gloss = ImageDraw.Draw(gloss)
# Subtle diagonal gradient for gloss
for y in range(nb_height):
    for x in range(nb_width):
        # Calculate a diagonal gradient
        val = int(255 * (1 - (x + y)/(nb_width+nb_height)))
        # Make it very transparent
        alpha = int(40 * (val/255.0))
        gloss.putpixel((x, y), (255, 255, 255, alpha))

drawing_glossy = Image.alpha_composite(drawing_resized, gloss)

# Also create a blank back cover (no icons, just the base color)
arr = np.array(drawing)
# Get most common color (background)
median_color = tuple(np.median(arr[:, :, :3], axis=(0,1)).astype(int))
back_face = Image.new("RGBA", (nb_width, nb_height), median_color + (255,))
back_face_glossy = Image.alpha_composite(back_face, gloss)

# 2. Colorize rings to turquoise
ring = Image.open(template_ring).convert("RGBA")
# The ring might be pink. We want turquoise (e.g. #00CED1 or rgb(0, 206, 209))
# Convert to grayscale then apply turquoise tint
gray_ring = ring.convert("L")
turquoise_ring = Image.new("RGBA", ring.size)
arr_gray = np.array(gray_ring)
arr_alpha = np.array(ring)[:, :, 3]

# Base turquoise: 0, 180, 200
r = (arr_gray / 255.0 * 0).astype(np.uint8)
g = (arr_gray / 255.0 * 180).astype(np.uint8)
b = (arr_gray / 255.0 * 200).astype(np.uint8)

turquoise_arr = np.dstack((r, g, b, arr_alpha))
turquoise_ring = Image.fromarray(turquoise_arr)

# Resize ring if needed
ring_w, ring_h = 70, 70
turquoise_ring = turquoise_ring.resize((ring_w, ring_h), Image.LANCZOS)

# 3. Assemble Front
canvas_w, canvas_h = 1024, 1024
front = Image.new("RGBA", (canvas_w, canvas_h), (255, 255, 255, 255))

# Add a subtle drop shadow
shadow_offset = 15
shadow = Image.new("RGBA", (canvas_w, canvas_h), (255, 255, 255, 255))
shadow_draw = ImageDraw.Draw(shadow)
shadow_draw.rectangle([
    (canvas_w//2 - nb_width//2 + shadow_offset, canvas_h//2 - nb_height//2 + shadow_offset),
    (canvas_w//2 + nb_width//2 + shadow_offset, canvas_h//2 + nb_height//2 + shadow_offset)
], fill=(0, 0, 0, 50))
shadow = shadow.filter(ImageFilter.GaussianBlur(15))
front.paste(shadow, (0, 0), shadow)

# Paste the glossy drawing
nb_x = canvas_w//2 - nb_width//2
nb_y = canvas_h//2 - nb_height//2
front.paste(drawing_glossy, (nb_x, nb_y), drawing_glossy)

# Paste 11 rings on LEFT
ring_x = nb_x - ring_w//2 + 5
spacing = (nb_height - 60) / 10
for i in range(11):
    ry = nb_y + 30 + int(i * spacing) - ring_h//2
    front.paste(turquoise_ring, (ring_x, ry), turquoise_ring)

front.save(out_front, "PNG")

# 4. Assemble Back
back = Image.new("RGBA", (canvas_w, canvas_h), (255, 255, 255, 255))
back.paste(shadow, (0, 0), shadow)

# Paste the drawing on the back! Wait, the user said "la contra tapa tiene que serdel mismo color que la tapa". 
# Usually back cover has the same pattern. 
# BUT we must mirror the logo/text or remove it?
# Let's just paste the original drawing so the text is correct!
# The rings go on the RIGHT for the back cover.
back.paste(drawing_glossy, (nb_x, nb_y), drawing_glossy)

# Paste 11 rings on RIGHT
ring_x_right = nb_x + nb_width - ring_w//2 - 5
for i in range(11):
    ry = nb_y + 30 + int(i * spacing) - ring_h//2
    back.paste(turquoise_ring, (ring_x_right, ry), turquoise_ring)

back.save(out_back, "PNG")

print("Mockups generated successfully.")
