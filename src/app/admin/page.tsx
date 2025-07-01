"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { secureLog } from '../utils/secureLogger';

// Direct imports instead of lazy loading to prevent unmounting issues
import ArticleEditor from '../components/admin/ArticleEditor';
import ImageUploader from '../components/admin/ImageUploader';
import UserAuth from '../components/admin/UserAuth';

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    role: 'admin' | 'editor' | 'contributor';
}

export default function AdminPage(): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<'articles' | 'images' | 'auth'>('auth');
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Create a stable reference for userProfile to prevent unnecessary re-renders
    const stableUserProfile = useMemo(() => userProfile, [userProfile?.id]);

    useEffect(() => {
        secureLog.debug('AdminPage: Checking authentication');
        const checkAuth = async () => {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser();

                if (authError || !user) {
                    secureLog.debug('AdminPage: No valid user found');
                    setError('Please log in to access the admin panel');
                    return;
                }

                secureLog.debug('AdminPage: User authenticated');
                // Create a basic user profile with fallbacks
                const newProfile = {
                    id: user.id,
                    email: user.email || '',
                    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                    role: 'admin' as const
                };
                secureLog.debug('AdminPage: Setting user profile');
                setUserProfile(newProfile);
            } catch (err) {
                secureLog.error('AdminPage: Authentication failed', err);
                setError('Authentication failed');
            } finally {
                secureLog.debug('AdminPage: Auth check complete');
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        // console.log('🔄 AdminPage: userProfile changed:', userProfile);
    }, [userProfile]);

    // Add auth state listener to track what's happening
    useEffect(() => {
        secureLog.debug('AdminPage: Setting up auth state listener');
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            secureLog.debug('AdminPage: Auth state changed', { event, hasSession: !!session });

            // Only react to actual sign out
            if (event === 'SIGNED_OUT') {
                secureLog.debug('AdminPage: User signed out, clearing profile');
                setUserProfile(null);
                setError('Please log in to access the admin panel');
            }
            // Don't react to other events to avoid re-renders
        });

        return () => {
            secureLog.debug('AdminPage: Cleaning up auth state listener');
            subscription.unsubscribe();
        };
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-white/60">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    if (error || !userProfile) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <div className="text-center glass-card-modern rounded-3xl p-8 max-w-md mx-auto">
                    <div className="text-red-400 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-white mb-4">Access Required</h2>
                    <p className="text-white/60 mb-6">{error || 'Please log in to access this page'}</p>
                    <UserAuth />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
            <nav className="bg-black/50 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <h1 className="text-white font-bold">Times of GIKI Admin</h1>
                        <span className="text-white/60">
                            Welcome, {userProfile.full_name}!
                        </span>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="glass-card-modern rounded-3xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Admin Panel</h2>

                    {/* Tab Navigation */}
                    <div className="flex space-x-4 mb-6">
                        <button
                            onClick={() => setActiveTab('articles')}
                            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'articles'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            Articles
                        </button>
                        <button
                            onClick={() => {
                                secureLog.debug('AdminPage: Switching to Images tab');
                                setActiveTab('images');
                            }}
                            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'images'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            Images
                        </button>
                        <button
                            onClick={() => setActiveTab('auth')}
                            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'auth'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            Authentication
                        </button>
                    </div>

                    {/* Tab Content - Always mounted components */}
                    <div className="mt-4">
                        <div className={activeTab === 'articles' ? 'block' : 'hidden'}>
                            <ArticleEditor userProfile={stableUserProfile} />
                        </div>
                        <div className={activeTab === 'images' ? 'block' : 'hidden'}>
                            <ImageUploader userProfile={stableUserProfile} />
                        </div>
                        <div className={activeTab === 'auth' ? 'block' : 'hidden'}>
                            {userProfile ? (
                                <div className="text-white/60">
                                    <p>Authenticated as: {userProfile.email}</p>
                                    <p>Role: {userProfile.role}</p>
                                    <p>User ID: {userProfile.id}</p>
                                    <UserAuth />
                                </div>
                            ) : (
                                <div className="text-white/60 p-4">Loading authentication info...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
