"use client";

import { memo, useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { secureLog } from '../../utils/secureLogger';

interface UserAuthProps {
    showSignOut?: boolean;
}

function UserAuth({ showSignOut = false }: UserAuthProps) {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Check current user
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            secureLog.debug('UserAuth: Auth state changed', { event, hasSession: !!session });

            if (event === 'SIGNED_IN') {
                secureLog.debug('UserAuth: User signed in successfully');
                setLoading(false);
                setUser(session?.user || null);
                // Refresh the page to update the admin panel
                window.location.reload();
            } else if (event === 'SIGNED_OUT') {
                secureLog.debug('UserAuth: User signed out');
                setLoading(false);
                setUser(null);
            } else if (event === 'TOKEN_REFRESHED') {
                secureLog.debug('UserAuth: Token refreshed');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        try {
            setLoading(true);
            secureLog.debug('UserAuth: Signing out user');
            const { error } = await supabase.auth.signOut();
            if (error) {
                secureLog.error('UserAuth: Sign out error', error);
            } else {
                secureLog.debug('UserAuth: Sign out successful');
                setUser(null);
                window.location.reload();
            }
        } catch (err) {
            secureLog.error('UserAuth: Sign out failed', err);
        } finally {
            setLoading(false);
        }
    };

    const customTheme = {
        default: {
            colors: {
                brand: '#3B82F6',
                brandAccent: '#2563EB',
                brandButtonText: 'white',
                defaultButtonBackground: 'rgba(255, 255, 255, 0.1)',
                defaultButtonBackgroundHover: 'rgba(255, 255, 255, 0.2)',
                defaultButtonBorder: 'rgba(255, 255, 255, 0.3)',
                defaultButtonText: 'white',
                dividerBackground: 'rgba(255, 255, 255, 0.2)',
                inputBackground: 'rgba(255, 255, 255, 0.1)',
                inputBorder: 'rgba(255, 255, 255, 0.3)',
                inputBorderHover: 'rgba(255, 255, 255, 0.4)',
                inputBorderFocus: '#3B82F6',
                inputText: 'white',
                inputLabelText: 'rgba(255, 255, 255, 0.8)',
                inputPlaceholder: 'rgba(255, 255, 255, 0.5)',
                messageText: 'white',
                messageTextDanger: '#EF4444',
                anchorTextColor: '#60A5FA',
                anchorTextHoverColor: '#93C5FD',
            },
            space: {
                spaceSmall: '4px',
                spaceMedium: '8px',
                spaceLarge: '16px',
                labelBottomMargin: '8px',
                anchorBottomMargin: '4px',
                emailInputSpacing: '4px',
                socialAuthSpacing: '4px',
                buttonPadding: '10px 15px',
                inputPadding: '10px 15px',
            },
            fontSizes: {
                baseBodySize: '13px',
                baseInputSize: '14px',
                baseLabelSize: '14px',
                baseButtonSize: '14px',
            },
            fonts: {
                bodyFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                buttonFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                inputFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                labelFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
            },
            borderWidths: {
                buttonBorderWidth: '1px',
                inputBorderWidth: '1px',
            },
            radii: {
                borderRadiusButton: '8px',
                buttonBorderRadius: '8px',
                inputBorderRadius: '8px',
            },
        },
    };

    return (
        <div className="glass-card-modern rounded-3xl p-8 w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-1a2 2 0 00-2-2H6a2 2 0 00-2 2v1a2 2 0 002 2zM12 7a4 4 0 00-4 4h8a4 4 0 00-4-4z" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
                <p className="text-white/60">
                    Sign in to access the Times Of GIKI admin panel
                </p>
            </div>

            {loading && (
                <div className="text-center mb-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent mx-auto"></div>
                    <p className="text-white/60 text-sm mt-2">
                        {user ? 'Signing you out...' : 'Signing you in...'}
                    </p>
                </div>
            )}

            {user && showSignOut ? (
                <div className="text-center space-y-4">
                    <p className="text-white/80">You are currently signed in</p>
                    <button
                        onClick={handleSignOut}
                        disabled={loading}
                        className="w-full glass-card-modern px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-red-500/20 transition-all duration-200 flex items-center justify-center space-x-2 group disabled:opacity-50"
                    >
                        <svg className="w-5 h-5 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            ) : (
                !user && (
                    <Auth
                        supabaseClient={supabase}
                        appearance={{
                            theme: ThemeSupa,
                            variables: customTheme
                        }}
                        providers={[]}
                        onlyThirdPartyProviders={false}
                        magicLink={true}
                        showLinks={false}
                        theme="default"
                    />
                )
            )}

            <div className="mt-6 text-center">
                <p className="text-white/40 text-sm">
                    Only authorized users can access this panel
                </p>
            </div>
        </div>
    );
}

export default memo(UserAuth);
