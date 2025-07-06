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
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
                {/* Background Effects */}
                <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
                <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>

                <div className="relative text-center">
                    <div className="glass-card-modern rounded-3xl p-8 max-w-sm mx-auto">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Loading Admin Panel</h3>
                        <p className="text-white/60">Please wait while we set things up...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !userProfile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
                {/* Background Effects */}
                <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
                <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>

                <div className="relative text-center glass-card-modern rounded-3xl p-8 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Access Required</h2>
                    <p className="text-white/60 mb-8">{error || 'Please log in to access this page'}</p>
                    <UserAuth />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>

            {/* Navigation Header */}
            <nav className="relative bg-black/30 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">TG</span>
                            </div>
                            <h1 className="text-white font-bold text-xl">Times of GIKI Admin</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-white/60 text-sm">
                                Welcome, {userProfile.full_name}!
                            </span>
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                    {userProfile.full_name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <button
                                onClick={async () => {
                                    try {
                                        secureLog.debug('AdminPage: Signing out user');
                                        const { error } = await supabase.auth.signOut();
                                        if (error) {
                                            secureLog.error('AdminPage: Sign out error', error);
                                            setError('Failed to sign out');
                                        } else {
                                            secureLog.debug('AdminPage: Sign out successful');
                                            setUserProfile(null);
                                            // Optionally refresh the page or redirect
                                            window.location.reload();
                                        }
                                    } catch (err) {
                                        secureLog.error('AdminPage: Sign out failed', err);
                                        setError('Sign out failed');
                                    }
                                }}
                                className="glass-card-modern px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-red-500/20 transition-all duration-200 flex items-center space-x-2 group"
                                title="Sign Out"
                            >
                                <svg className="w-4 h-4 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="text-sm font-medium">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="glass-card-modern rounded-3xl p-8">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h2>
                        <p className="text-white/60">Manage your Times of GIKI content</p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-8">
                        <div className="glass-card-modern rounded-2xl p-2 inline-flex space-x-1">
                            <button
                                onClick={() => setActiveTab('articles')}
                                className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'articles'
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                📝 Articles
                            </button>
                            <button
                                onClick={() => {
                                    secureLog.debug('AdminPage: Switching to Images tab');
                                    setActiveTab('images');
                                }}
                                className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'images'
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                🖼️ Gallery
                            </button>
                            <button
                                onClick={() => setActiveTab('auth')}
                                className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'auth'
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                🔐 Account
                            </button>
                        </div>
                    </div>

                    {/* Tab Content - Always mounted components */}
                    <div className="mt-6">
                        <div className={activeTab === 'articles' ? 'block' : 'hidden'}>
                            <ArticleEditor userProfile={stableUserProfile} />
                        </div>
                        <div className={activeTab === 'images' ? 'block' : 'hidden'}>
                            <ImageUploader userProfile={stableUserProfile} />
                        </div>
                        <div className={activeTab === 'auth' ? 'block' : 'hidden'}>
                            {userProfile ? (
                                <div className="glass-card-modern rounded-2xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Account Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                            <span className="text-white/60">Email:</span>
                                            <span className="text-white">{userProfile.email}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                            <span className="text-white/60">Role:</span>
                                            <span className="text-blue-400 font-medium">{userProfile.role}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                            <span className="text-white/60">User ID:</span>
                                            <span className="text-white/80 text-sm font-mono">{userProfile.id}</span>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <UserAuth showSignOut={true} />
                                    </div>
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
