"use client";

import { useState, useEffect, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import Navigation from '../components/Navigation';
import ModernBackground from '../components/ModernBackground';
import { User } from '@supabase/supabase-js';

// Lazy load heavy components
const ArticleEditor = lazy(() => import('../components/admin/ArticleEditor'));
const ImageUploader = lazy(() => import('../components/admin/ImageUploader'));
const UserAuth = lazy(() => import('../components/admin/UserAuth'));

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    role: 'admin' | 'editor' | 'contributor';
    avatar_url?: string;
}

// Loading component for suspense
const ComponentLoader = () => (
    <div className="glass-card-modern rounded-3xl p-8">
        <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mr-3"></div>
            <span className="text-white/80">Loading component...</span>
        </div>
    </div>
);

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'articles' | 'gallery' | 'users'>('articles'); useEffect(() => {
        // Check if user is logged in
        const checkUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);

                if (user) {
                    // Get user profile with role
                    const { data: profile } = await supabase
                        .from('user_profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    setUserProfile(profile);
                }
            } catch (error) {
                console.error('Error checking user:', error);
            } finally {
                setLoading(false);
            }
        };

        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user || null);
                if (session?.user) {
                    try {
                        const { data: profile } = await supabase
                            .from('user_profiles')
                            .select('*')
                            .eq('id', session.user.id)
                            .single();
                        setUserProfile(profile);
                    } catch (error) {
                        console.error('Error fetching profile:', error);
                    }
                } else {
                    setUserProfile(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []); if (loading) {
        return (
            <div className="min-h-screen relative overflow-hidden">
                <ModernBackground />
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="glass-card-modern rounded-3xl p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
                        <p className="text-white text-center mt-4">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Check if Supabase is properly configured
    if (!isSupabaseConfigured) {
        return (
            <div className="min-h-screen relative overflow-hidden">
                <ModernBackground />
                <div className="relative z-10">
                    <Navigation />
                    <div className="flex items-center justify-center min-h-screen pt-20">
                        <div className="glass-card-modern rounded-3xl p-8 max-w-2xl text-center">
                            <div className="text-6xl mb-6">⚙️</div>
                            <h2 className="text-3xl font-bold text-white mb-4">Setup Required</h2>
                            <p className="text-white/80 mb-6 leading-relaxed">
                                Welcome to Times Of GIKI Admin Panel! To get started, you need to configure Supabase:
                            </p>
                            <div className="bg-black/20 rounded-xl p-6 mb-6 text-left">
                                <h3 className="text-white font-semibold mb-3">Quick Setup Steps:</h3>
                                <ol className="text-white/70 space-y-2 text-sm">
                                    <li>1. Create a free Supabase account at <code className="bg-white/10 px-2 py-1 rounded">supabase.com</code></li>
                                    <li>2. Create a new project and get your credentials</li>
                                    <li>3. Update the <code className="bg-white/10 px-2 py-1 rounded">.env.local</code> file with your credentials</li>
                                    <li>4. Run the SQL setup script in your Supabase dashboard</li>
                                    <li>5. Restart your development server</li>
                                </ol>
                            </div>
                            <p className="text-blue-300 text-sm">
                                📖 Check <code className="bg-white/10 px-2 py-1 rounded">CMS_SETUP_GUIDE.md</code> for detailed instructions
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    } if (!user || !userProfile) {
        return (
            <div className="min-h-screen relative overflow-hidden">
                <ModernBackground />
                <div className="relative z-10">
                    <Navigation />
                    <div className="flex items-center justify-center min-h-screen pt-20">
                        <Suspense fallback={<ComponentLoader />}>
                            <UserAuth />
                        </Suspense>
                    </div>
                </div>
            </div>
        );
    }

    // Check if user has permission to access admin panel
    if (!['admin', 'editor', 'contributor'].includes(userProfile.role)) {
        return (
            <div className="min-h-screen relative overflow-hidden">
                <ModernBackground />
                <div className="relative z-10">
                    <Navigation />
                    <div className="flex items-center justify-center min-h-screen pt-20">
                        <div className="glass-card-modern rounded-3xl p-8 max-w-md text-center">
                            <div className="text-red-400 text-6xl mb-4">🚫</div>
                            <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>                            <p className="text-white/80">
                                You don&apos;t have permission to access the admin panel.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            <ModernBackground />

            <div className="relative z-10">
                <Navigation />

                <div className="pt-24 pb-12 px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="glass-card-modern rounded-3xl p-8 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">
                                        Admin Dashboard
                                    </h1>
                                    <p className="text-white/60">
                                        Welcome back, {userProfile.full_name || userProfile.email}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium uppercase">
                                        {userProfile.role}
                                    </span>                                    <button
                                        onClick={async () => {
                                            try {
                                                await supabase.auth.signOut();
                                                router.push('/admin');
                                            } catch (error) {
                                                console.error('Error signing out:', error);
                                                // Force refresh if needed
                                                window.location.href = '/admin';
                                            }
                                        }}
                                        className="text-red-400 hover:text-red-300 transition-colors px-3 py-1 rounded-lg hover:bg-red-500/10"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
                                {[
                                    { id: 'articles', label: 'Articles', icon: '📝' },
                                    { id: 'gallery', label: 'Gallery', icon: '🖼️' },
                                    ...(userProfile.role === 'admin' ? [{ id: 'users', label: 'Users', icon: '👥' }] : [])
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as 'articles' | 'gallery' | 'users')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all ${activeTab === tab.id
                                            ? 'bg-blue-500/20 text-blue-300'
                                            : 'text-white/60 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <span>{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>                        {/* Tab Content */}
                        <Suspense fallback={<ComponentLoader />}>
                            {activeTab === 'articles' && (
                                <ArticleEditor userProfile={userProfile} />
                            )}

                            {activeTab === 'gallery' && (
                                <ImageUploader userProfile={userProfile} />
                            )}

                            {activeTab === 'users' && userProfile.role === 'admin' && (
                                <div className="glass-card-modern rounded-3xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
                                    <p className="text-white/60">User management features coming soon...</p>
                                </div>
                            )}
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
