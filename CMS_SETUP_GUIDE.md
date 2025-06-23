# Times Of GIKI - Content Management System Setup Guide

## 🚀 Local Development Setup

### 1. Supabase Setup

1. **Create a Supabase Project**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Create a new project
   - Wait for the project to be ready

2. **Get your Supabase credentials**
   - Go to Settings → API
   - Copy the following:
     - Project URL
     - Anon Public Key
     - Service Role Key (for admin functions)

3. **Set up Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Replace the placeholder values with your actual Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the Database**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `database/setup.sql`
   - Run the script to create all necessary tables and policies

### 2. Authentication Setup

1. **Configure Auth Providers**
   - In Supabase dashboard: Authentication → Providers
   - Enable Email/Password authentication
   - Optionally enable Google OAuth for easier sign-in

2. **Set up Site URL**
   - In Authentication → Settings
   - Add `http://localhost:3000` to Site URL
   - Add `http://localhost:3000/admin` to Redirect URLs

### 3. Storage Setup

1. **Configure Image Storage**
   - The SQL script creates an 'images' bucket automatically
   - Go to Storage in Supabase dashboard to verify the bucket exists
   - The bucket is set to public for easy image serving

### 4. Running the Application

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Main site: `http://localhost:3000`
   - Admin panel: `http://localhost:3000/admin`

## 👥 User Management

### Creating Admin Users

1. **First Admin User**
   - Sign up through the admin panel (`/admin`)
   - Go to Supabase dashboard → Authentication → Users
   - Find your user and copy the User ID
   - Go to SQL Editor and run:
   ```sql
   UPDATE user_profiles 
   SET role = 'admin' 
   WHERE id = 'your-user-id-here';
   ```

2. **Adding More Users**
   - Admin users can promote other users through the admin panel
   - Or manually update roles in the database

### User Roles

- **admin**: Full access - can manage all content and users
- **editor**: Can create, edit, and publish articles and images
- **contributor**: Can create and edit their own content (requires approval for publishing)

## 📝 Content Management

### Articles
- Create rich text articles with categories
- Add featured images
- Draft and publish system
- Author attribution

### Gallery Images
- Upload images with titles and descriptions
- Featured image system
- Alt text for accessibility
- Automatic image optimization

## 🔒 Security Features

- Row Level Security (RLS) on all tables
- User authentication with Supabase Auth
- Role-based permissions
- Secure file upload to Supabase Storage
- Protected admin routes

## 🔧 Development Notes

### Adding New Features
- All database operations use Supabase client
- Real-time updates supported (can be added easily)
- Glassmorphism UI components in `/components`
- Type-safe with TypeScript

### Database Schema
- `user_profiles`: User information and roles
- `articles`: Blog articles with full content
- `gallery_images`: Image gallery with metadata
- All tables have RLS policies for security

## 📱 Deployment Ready

When ready to deploy:
1. Update environment variables for production
2. Configure production URLs in Supabase Auth settings
3. The app is already optimized for Vercel deployment

## 🆘 Troubleshooting

### Common Issues
1. **Auth not working**: Check if Site URLs are configured correctly
2. **Images not uploading**: Verify Storage bucket exists and RLS policies are set
3. **Permission denied**: Check user roles and RLS policies
4. **Build errors**: Ensure all environment variables are set

### Support
- Check Supabase logs for database errors
- Use browser dev tools for client-side issues
- Supabase has excellent documentation at [https://supabase.com/docs](https://supabase.com/docs)
