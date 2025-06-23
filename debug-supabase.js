// Debug script to check Supabase configuration
const fs = require('fs');

// Read .env.local file manually
const envContent = fs.readFileSync('.env.local', 'utf8');
const envLines = envContent.split('\n');

let supabaseUrl = 'https://placeholder.supabase.co';
let supabaseAnonKey = 'placeholder-key';

envLines.forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
        supabaseUrl = line.split('=')[1] || 'https://placeholder.supabase.co';
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
        supabaseAnonKey = line.split('=')[1] || 'placeholder-key';
    }
});

console.log('Environment Variables:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey);
console.log('');

console.log('Configuration Check:');
console.log('URL is not placeholder:', supabaseUrl !== 'https://placeholder.supabase.co');
console.log('Key is not placeholder:', supabaseAnonKey !== 'placeholder-key');
console.log('URL does not contain placeholder text:', !supabaseUrl.includes('your_supabase_url_here'));
console.log('Key does not contain placeholder text:', !supabaseAnonKey.includes('your_supabase_anon_key_here'));
console.log('URL starts with https:', supabaseUrl.startsWith('https://'));
console.log('Key length > 20:', supabaseAnonKey.length > 20);
console.log('Key length:', supabaseAnonKey.length);

const hasValidCredentials =
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    supabaseAnonKey !== 'placeholder-key' &&
    !supabaseUrl.includes('your_supabase_url_here') &&
    !supabaseAnonKey.includes('your_supabase_anon_key_here') &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20;

console.log('');
console.log('Final result - hasValidCredentials:', hasValidCredentials);
