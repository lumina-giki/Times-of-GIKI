-- Add missing credit column to gallery_images table
-- Run this in your Supabase SQL Editor

ALTER TABLE gallery_images 
ADD COLUMN IF NOT EXISTS credit TEXT;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'gallery_images' 
ORDER BY ordinal_position;
