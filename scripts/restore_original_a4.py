import os
import shutil

brain_prev = r"C:\Users\Leandro\.gemini\antigravity\brain\ce18a836-6317-4fdf-92fc-6bf9f51a79ef"
brain_curr = r"C:\Users\Leandro\.gemini\antigravity\brain\6fe645c8-5944-44f2-a45c-6b68d01777bd"
pub = r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images"

# 1. Amelie
shutil.copy2(os.path.join(brain_prev, "media__1779654869285.jpg"), os.path.join(pub, "mockup_amelie_front.jpg"))
shutil.copy2(os.path.join(brain_prev, "media__1779654869307.jpg"), os.path.join(pub, "mockup_amelie_back.jpg"))

# 2. Coffee Time
shutil.copy2(os.path.join(brain_curr, "media__1779656692534.jpg"), os.path.join(pub, "mockup_coffee_time_front.jpg"))

print("Restored original images")
