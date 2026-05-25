import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixImages() {
  console.log("Fixing Yendo back cover...");
  // First, copy the generated image into public/images
  const src = "C:\\Users\\Leandro\\.gemini\\antigravity\\brain\\0afc3e0d-9578-4f83-8b21-763e810c9cb8\\mockup_yendo_back_fixed_1779752076542.png";
  const dest = path.join(process.cwd(), "public", "images", "mockup_yendo_back_fixed.png");
  if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log("Copied Yendo back image.");
  } else {
      console.error("Yendo back image not found in brain folder!");
  }

  // Get Yendo
  const { data: yendo } = await supabase.from('products').select('*').ilike('name', '%Yendo%').single();
  if (yendo) {
      const newGallery = yendo.gallery.map(img => 
          img.includes('mockup_yendo_back') ? '/images/mockup_yendo_back_fixed.png' : img
      );
      await supabase.from('products').update({ gallery: newGallery }).eq('id', yendo.id);
      console.log("Updated Yendo gallery.");
  }

  // Get Sol de Mayo
  console.log("Fixing Sol de Mayo interior...");
  const { data: sol } = await supabase.from('products').select('*').ilike('name', '%Sol de Mayo%').single();
  if (sol) {
      const newGallery = sol.gallery.map(img => {
          if (img.includes('mockup_arg_interior_1')) return '/images/mockup_stamps_interior_1.png';
          if (img.includes('mockup_arg_interior_2')) return '/images/mockup_stamps_interior_2.png';
          if (img.includes('mockup_arg_interior_3')) return '/images/mockup_stamps_interior_3.png';
          if (img.includes('mockup_arg_interior_4')) return '/images/mockup_stamps_interior_4.png';
          return img;
      });
      await supabase.from('products').update({ gallery: newGallery }).eq('id', sol.id);
      console.log("Updated Sol de Mayo gallery.");
  }
}
fixImages();
