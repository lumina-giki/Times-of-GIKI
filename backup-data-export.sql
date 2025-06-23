-- Export script for Times of GIKI data
-- Run these in your OLD Supabase SQL editor to backup data

-- Export articles
SELECT 
    id, title, content, excerpt, author, category, 
    featured_image, published, author_id, created_at, updated_at
FROM articles 
ORDER BY created_at;

-- Export gallery_images  
SELECT 
    id, title, description, image_url, alt_text, 
    uploaded_by, credit, featured, author_id, created_at
FROM gallery_images 
ORDER BY created_at;

-- Export user_profiles
SELECT 
    id, email, full_name, role, avatar_url, created_at
FROM user_profiles
ORDER BY created_at;

-- Note: Save these results as CSV or copy to import into new project
