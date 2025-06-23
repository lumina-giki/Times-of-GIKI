# Email Templates for Times of GIKI

This directory contains professionally designed email templates for all authentication flows in the Times of GIKI application. Each template follows the brand's glassmorphism design with consistent styling.

## Available Templates

### 1. Magic Link Template (`magic-link-template.html`)
**Purpose:** For passwordless sign-in
**Variables:**
- `{{ .ConfirmationURL }}` - The magic link URL
**Color Scheme:** Blue gradient
**Use Case:** When users request to sign in via email link

### 2. Confirm Signup Template (`confirm-signup-template.html`)
**Purpose:** Email verification for new user registration
**Variables:**
- `{{ .ConfirmationURL }}` - Email confirmation URL
**Color Scheme:** Green gradient
**Features:** Welcome message with feature highlights
**Use Case:** After user creates a new account

### 3. Invite User Template (`invite-user-template.html`)
**Purpose:** User invitation emails
**Variables:**
- `{{ .ConfirmationURL }}` - Invitation acceptance URL
- `{{ .InviterName }}` - Name of the person sending the invitation
**Color Scheme:** Purple gradient
**Features:** Personalized invitation with inviter information
**Use Case:** When existing users invite new members

### 4. Change Email Template (`change-email-template.html`)
**Purpose:** Email address change confirmation
**Variables:**
- `{{ .ConfirmationURL }}` - Email change confirmation URL
- `{{ .OldEmail }}` - Current email address
- `{{ .NewEmail }}` - New email address
**Color Scheme:** Orange gradient
**Features:** Shows old and new email addresses
**Use Case:** When users update their email address

### 5. Reset Password Template (`reset-password-template.html`)
**Purpose:** Password reset requests
**Variables:**
- `{{ .ConfirmationURL }}` - Password reset URL
**Color Scheme:** Red gradient
**Features:** Security tips and expiration notice
**Use Case:** When users forget their password

### 6. Reauthentication Template (`reauthentication-template.html`)
**Purpose:** Additional security verification
**Variables:**
- `{{ .ConfirmationURL }}` - Reauthentication URL
- `{{ .Reason }}` - Reason for reauthentication
- `{{ .ActionDescription }}` - Description of the action being performed
- `{{ .Timestamp }}` - When the request was made
- `{{ .IPAddress }}` - User's IP address
**Color Scheme:** Teal gradient
**Features:** Context about why reauthentication is needed
**Use Case:** For sensitive operations requiring additional verification

## Design Features

### Consistent Branding
- **Logo:** Times Of GIKI
- **Tagline:** "A vibrant look at GIKI through images & stories"
- **Typography:** System fonts for better readability
- **Layout:** Glassmorphism design with backdrop blur effects

### Responsive Design
- Mobile-friendly layout
- Proper viewport settings
- Flexible container sizing

### Accessibility
- High contrast text
- Clear button styling
- Semantic HTML structure
- Alt text for visual elements

### Security Features
- Clear expiration notices
- Security tips where appropriate
- Contextual information for verification
- Professional security messaging

## Integration with Supabase

These templates are designed to work with Supabase Auth email templates. To use them:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Email Templates
3. Select the appropriate template type
4. Copy the HTML content from the corresponding file
5. Customize the variables as needed

## Template Variables

All templates use Supabase's template variable syntax `{{ .VariableName }}`. Common variables include:

- `{{ .ConfirmationURL }}` - The action URL (always present)
- `{{ .SiteURL }}` - Your site's URL
- `{{ .Email }}` - User's email address
- `{{ .Token }}` - Authentication token

## Customization

To customize these templates:

1. Update colors in the CSS gradient definitions
2. Modify the logo and subtitle in the header section
3. Adjust spacing and typography in the CSS
4. Add or remove features sections as needed
5. Update footer information

## File Structure
```
email-templates/
├── README.md                        # This documentation
├── magic-link-template.html         # Sign in via email
├── confirm-signup-template.html     # Email verification
├── invite-user-template.html        # User invitations
├── change-email-template.html       # Email change confirmation
├── reset-password-template.html     # Password reset
└── reauthentication-template.html   # Security reauthentication
```

## Testing

Before deploying, test each template:

1. Preview the HTML in a browser
2. Test with actual variables filled in
3. Check mobile responsiveness
4. Verify all links work correctly
5. Test email deliverability

## Maintenance

- Regularly update contact information
- Review and update security messaging
- Ensure brand consistency across templates
- Monitor user feedback for improvements
