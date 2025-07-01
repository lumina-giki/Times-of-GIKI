// Development-only logging utility with security controls
// This ensures no sensitive data is logged in production

const isDevelopment = process.env.NODE_ENV === 'development';

interface LogData {
    [key: string]: unknown;
}

// Sanitize sensitive data from logs
const sanitizeLogData = (data: LogData): LogData => {
    const sanitized = { ...data };
    
    // Remove or mask sensitive fields
    const sensitiveFields = [
        'password', 'token', 'secret', 'key', 'email', 'id', 
        'session', 'auth', 'user_id', 'access_token', 'refresh_token'
    ];
    
    for (const field of sensitiveFields) {
        if (field in sanitized) {
            if (typeof sanitized[field] === 'string') {
                // Mask email addresses
                if (field === 'email' && typeof sanitized[field] === 'string') {
                    const email = sanitized[field] as string;
                    sanitized[field] = email.replace(/(.{1,3}).*(@.*)/, '$1***$2');
                } else {
                    sanitized[field] = '***REDACTED***';
                }
            } else {
                sanitized[field] = '***REDACTED***';
            }
        }
    }
    
    return sanitized;
};

export const secureLog = {
    // Only log in development
    debug: (message: string, data?: LogData) => {
        if (isDevelopment) {
            if (data) {
                console.log(`🔧 DEBUG: ${message}`, sanitizeLogData(data));
            } else {
                console.log(`🔧 DEBUG: ${message}`);
            }
        }
    },
    
    info: (message: string, data?: LogData) => {
        if (isDevelopment) {
            if (data) {
                console.log(`ℹ️ INFO: ${message}`, sanitizeLogData(data));
            } else {
                console.log(`ℹ️ INFO: ${message}`);
            }
        }
    },
    
    // Always log errors (but sanitized)
    error: (message: string, error?: unknown) => {
        if (error instanceof Error) {
            console.error(`❌ ERROR: ${message}`, {
                message: error.message,
                // Don't log stack traces in production
                ...(isDevelopment && { stack: error.stack })
            });
        } else {
            console.error(`❌ ERROR: ${message}`);
        }
    },
    
    // Always log warnings (but sanitized)
    warn: (message: string, data?: LogData) => {
        if (data) {
            console.warn(`⚠️ WARNING: ${message}`, sanitizeLogData(data));
        } else {
            console.warn(`⚠️ WARNING: ${message}`);
        }
    }
};

// Export development mode check
export { isDevelopment };
