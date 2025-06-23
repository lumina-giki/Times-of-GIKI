"use client";

import { memo } from 'react';
import { supabase } from '../../../lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

function UserAuth() {
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
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-1a2 2 0 00-2-2H6a2 2 0 00-2 2v1a2 2 0 002 2zM12 7a4 4 0 00-4 4h8a4 4 0 00-4-4z" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
                <p className="text-white/60">
                    Sign in to access the Times Of GIKI admin panel                </p>
            </div>

            <Auth
                supabaseClient={supabase}
                appearance={{
                    theme: ThemeSupa,
                    variables: customTheme
                }}
                providers={[]}
                redirectTo={`${window?.location?.origin}/admin`}
                onlyThirdPartyProviders={false}
                magicLink={true}
                showLinks={false}
                theme="default"
            />

            <div className="mt-6 text-center">
                <p className="text-white/40 text-sm">
                    Only authorized users can access this panel
                </p>            </div>
        </div>
    );
}

export default memo(UserAuth);
