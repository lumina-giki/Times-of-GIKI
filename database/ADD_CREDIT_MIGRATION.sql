-- MIGRATION: Add credit field to gallery_images table
-- Run this in Supabase SQL Editor if you have an existing database

-- Add credit column to gallery_images table
ALTER TABLE gallery_images 
ADD COLUMN IF NOT EXISTS credit TEXT;

-- This migration is idempotent and safe to run multiple times
-- If the column already exists, it will be ignored

-- SUCCESS! Credit column has been added to gallery_images table
