import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function revertGallery() {
  const { data: yendo } = await supabase.from('products').select('*').ilike('name', '%Yendo%').single();
  if (yendo) {
      const newGallery = yendo.gallery.map(img => 
          img.includes('mockup_yendo_back_fixed') ? '/images/mockup_yendo_back.jpg' : img
      );
      await supabase.from('products').update({ gallery: newGallery }).eq('id', yendo.id);
      console.log("Reverted Yendo gallery to original back cover.");
  }
}
revertGallery();
