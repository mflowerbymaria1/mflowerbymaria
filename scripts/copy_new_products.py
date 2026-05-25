import shutil
import os

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"
brain = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"

# Copy images
shutil.copy2(os.path.join(brain, "media__1779671733391.jpg"), os.path.join(pub, "block_papeles_inspiracion_1.jpg"))
shutil.copy2(os.path.join(brain, "media__1779671733441.jpg"), os.path.join(pub, "block_papeles_inspiracion_2.jpg"))
shutil.copy2(os.path.join(brain, "media__1779671912159.jpg"), os.path.join(pub, "block_hojas_osito.jpg"))
shutil.copy2(os.path.join(brain, "media__1779671912168.jpg"), os.path.join(pub, "block_hojas_cerezas.jpg"))

print("Images copied.")
