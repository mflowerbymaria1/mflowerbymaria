from PIL import Image, ImageDraw, ImageFilter
import os
import shutil

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

# 1. Remove Gemini logo from Amelie front and back
def remove_logo(filename):
    path = os.path.join(pub, filename)
    img = Image.open(path).convert("RGB")
    w, h = img.size
    
    # We will sample a background color from slightly above the logo area
    # The logo is in the bottom right. Let's sample from w-10, h-120
    bg_color = img.getpixel((w-10, h-120))
    
    # Paint over a 100x100 area in the bottom right
    draw = ImageDraw.Draw(img)
    draw.rectangle([w-100, h-100, w, h], fill=bg_color)
    
    img.save(path, quality=95)
    print(f"Removed logo from {filename}")

remove_logo("mockup_amelie_front.jpg")
remove_logo("mockup_amelie_back.jpg")

# 2. Add 5th disc to Maleva back
def fix_maleva_back():
    path = os.path.join(pub, "mockup_maleva_back.jpg")
    img = Image.open(path).convert("RGB")
    w, h = img.size
    
    # In my previous investigation, the discs are around x=800-1000
    # Let's crop a disc manually based on visual estimation.
    # The image is 1024x571 (or something similar). Wait, Maleva back is 1024x768 now?
    # No, I restored it to the original which is 1024x571. Let me verify the size.
    print(f"Maleva back size: {w}x{h}")
    
    # Discs are on the right edge. Let's find the bounding box of all discs.
    # We know the background is white.
    bg_color = img.getpixel((0, 0))
    
    # Scan from top to bottom at x=w-30 (which should be inside the discs)
    # The back cover has discs on the RIGHT.
    disc_centers = []
    in_disc = False
    disc_start = 0
    # Search around x = w-50
    search_x = w - 50
    for y in range(h):
        r, g, b = img.getpixel((search_x, y))
        is_disc = abs(r - bg_color[0]) > 20 or abs(g - bg_color[1]) > 20 or abs(b - bg_color[2]) > 20
        if is_disc and not in_disc:
            disc_start = y
            in_disc = True
        elif not is_disc and in_disc:
            disc_centers.append((disc_start + y) // 2)
            in_disc = False

    print(f"Maleva back disc centers found: {disc_centers}")
    
    # If we didn't find them, we will use hardcoded values based on visual inspection
    # The image is 1024x571. Discs are roughly at y=200, 270, 340, 410
    if len(disc_centers) < 4:
        print("Could not auto-detect discs. Using hardcoded positions.")
        # We need to find the exact y positions. We'll do a wider search.
        disc_centers = [190, 260, 330, 400] # Approximate
        
    # We will copy the first disc, clear the whole disc column, and paste 5 discs evenly spaced
    first_y = disc_centers[0]
    last_y = disc_centers[-1]
    total_span = last_y - first_y
    
    # Extract template
    tc = disc_centers[0]
    half_h = 25
    left_x = w - 100
    right_x = w
    
    template = img.crop((left_x, tc - half_h, right_x, tc + half_h))
    
    # Clear column
    draw = ImageDraw.Draw(img)
    draw.rectangle([left_x, first_y - half_h - 10, right_x, last_y + half_h + 10], fill=bg_color)
    
    # Paste 5 discs
    new_spacing = total_span / 4
    for i in range(5):
        paste_y = int(first_y + i * new_spacing) - half_h
        # We paste without mask since background matches
        img.paste(template, (left_x, paste_y))
        
    img.save(path, quality=95)
    print("Fixed Maleva back to 5 discs")

fix_maleva_back()

# 3. Change Candy front from 9 to 8 discs
def fix_candy_front():
    path = os.path.join(pub, "mockup_candy_front.jpg")
    img = Image.open(path).convert("RGB")
    w, h = img.size
    print(f"Candy front size: {w}x{h}")
    
    # Discs are on the LEFT. Background is white.
    bg_color = img.getpixel((w-1, 0)) # Sample top right
    
    # Let's find the discs by scanning down x=30
    search_x = 30
    disc_centers = []
    in_disc = False
    disc_start = 0
    for y in range(h):
        r, g, b = img.getpixel((search_x, y))
        is_disc = abs(r - bg_color[0]) > 20 or abs(g - bg_color[1]) > 20 or abs(b - bg_color[2]) > 20
        if is_disc and not in_disc:
            disc_start = y
            in_disc = True
        elif not is_disc and in_disc:
            disc_centers.append((disc_start + y) // 2)
            in_disc = False

    print(f"Candy front disc centers found: {disc_centers}")
    
    if len(disc_centers) < 9:
        print("Could not auto-detect Candy discs.")
        # Hardcode based on visual inspection of a typical 9-disc planner
        # We'll just try to find them by looking at a different x
        search_x = 15
        disc_centers = []
        in_disc = False
        for y in range(h):
            r, g, b = img.getpixel((search_x, y))
            is_disc = abs(r - bg_color[0]) > 10 or abs(g - bg_color[1]) > 10 or abs(b - bg_color[2]) > 10
            if is_disc and not in_disc:
                disc_start = y
                in_disc = True
            elif not is_disc and in_disc:
                disc_centers.append((disc_start + y) // 2)
                in_disc = False
        print(f"Candy front disc centers (try 2): {disc_centers}")
        
    if len(disc_centers) < 8:
         # I will just use fixed bounding boxes for the column and copy paste to cover it up, then redraw
         print("Using fallback for Candy front")
         disc_centers = [120, 210, 300, 390, 480, 570, 660, 750, 840]

    # We have alternating pink and green discs. Let's capture the first (pink) and second (green)
    first_y = disc_centers[0]
    last_y = disc_centers[-1]
    total_span = last_y - first_y
    
    half_h = 25
    left_x = 0
    right_x = 70
    
    template_pink = img.crop((left_x, disc_centers[0] - half_h, right_x, disc_centers[0] + half_h))
    template_green = img.crop((left_x, disc_centers[1] - half_h, right_x, disc_centers[1] + half_h))
    
    # Clear column
    draw = ImageDraw.Draw(img)
    draw.rectangle([left_x, first_y - half_h - 10, right_x, last_y + half_h + 10], fill=bg_color)
    
    # Paste 8 discs (7 gaps)
    new_spacing = total_span / 7
    for i in range(8):
        paste_y = int(first_y + i * new_spacing) - half_h
        template = template_pink if i % 2 == 0 else template_green
        img.paste(template, (left_x, paste_y))
        
    img.save(path, quality=95)
    print("Fixed Candy front to 8 discs")

fix_candy_front()

