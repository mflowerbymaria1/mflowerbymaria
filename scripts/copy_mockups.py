import shutil

files = [
    (r"C:\Users\Leandro\.gemini\antigravity\brain\d9215158-7aa4-46a9-8d2c-141c4d39e290\mockup_int_temario_v2_1778886701402.png", r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images\mockup_interior_1.png"),
    (r"C:\Users\Leandro\.gemini\antigravity\brain\d9215158-7aa4-46a9-8d2c-141c4d39e290\mockup_int_dobletem_v2_1778886760064.png", r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images\mockup_interior_2.png"),
    (r"C:\Users\Leandro\.gemini\antigravity\brain\d9215158-7aa4-46a9-8d2c-141c4d39e290\mockup_int_cumple_v2_1778886814350.png", r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images\mockup_interior_3.png"),
    (r"C:\Users\Leandro\.gemini\antigravity\brain\d9215158-7aa4-46a9-8d2c-141c4d39e290\mockup_int_cal2026_v2_1778886913849.png", r"C:\Users\Leandro\.gemini\antigravity\scratch\mflowerbymaria\public\images\mockup_interior_4.png")
]

for src, dst in files:
    try:
        shutil.copy2(src, dst)
        print(f"Copied {src} to {dst}")
    except Exception as e:
        print(f"Error copying {src}: {e}")
