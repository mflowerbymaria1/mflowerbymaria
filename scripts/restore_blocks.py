import shutil
import os

pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"
brain = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"

# The 2 block de papeles files from earlier
# I will just restore them completely raw.
files = [
    ("media__1779672430147.jpg", "block_papeles_inspiracion_1.jpg"), # text
    ("media__1779672430024.jpg", "block_papeles_inspiracion_2.jpg")  # collage
]

for src, dst in files:
    src_path = os.path.join(brain, src)
    dst_path = os.path.join(pub, dst)
    shutil.copy2(src_path, dst_path)

print("Restored original raw images.")
