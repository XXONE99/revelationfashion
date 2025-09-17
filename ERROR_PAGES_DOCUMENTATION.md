# Error Pages Documentation

## Overview
This project includes 3 types of error pages with beautiful illustrations and animations:

1. **404 Error Page** - Robot illustration for page not found
2. **No Data Found** - Broken paper illustration for empty states
3. **Server Error** - Server illustration for internal errors

## File Structure

### Components
```
components/error-pages/
├── 404-error.tsx          # Robot 404 page component
├── no-data-error.tsx      # Broken paper no data component
├── server-error.tsx       # Server error component
└── index.tsx             # Export file
```

### User Pages
```
app/
├── not-found.tsx         # Global 404 (automatic)
├── error.tsx            # Global error (automatic)
├── 404/page.tsx         # Direct 404 page
├── no-data/page.tsx     # Direct no data page
├── server-error/page.tsx # Direct server error page
└── error-demo/page.tsx  # Demo page to test all errors
```

### Admin Pages
```
app/admin/
├── not-found.tsx         # Admin 404 (automatic)
├── error.tsx            # Admin error (automatic)
├── 404/page.tsx         # Direct admin 404 page
├── no-data/page.tsx     # Direct admin no data page
└── server-error/page.tsx # Direct admin server error page
```

## How It Works

### Automatic Error Pages
Next.js automatically uses these files when errors occur:
- `app/not-found.tsx` - Triggered on 404 errors
- `app/error.tsx` - Triggered on server errors
- `app/admin/not-found.tsx` - Triggered on admin 404 errors
- `app/admin/error.tsx` - Triggered on admin server errors

### Direct Access Pages
These pages can be accessed directly via URL:
- `/404` - User 404 page
- `/no-data` - User no data page
- `/server-error` - User server error page
- `/admin/404` - Admin 404 page
- `/admin/no-data` - Admin no data page
- `/admin/server-error` - Admin server error page
- `/error-demo` - Demo page to test all errors

## Features

### 404 Error Page
- **Illustration**: Blue robot with broken antenna, orange eyes, and wrench
- **Animations**: Robot rotation, wrench movement, spark blinking
- **Background**: Transparent "44" numbers
- **Actions**: "GO BACK HOME" and "Go Back" buttons
- **Dark Mode**: Full dark mode support

### No Data Found Page
- **Illustration**: White paper with sad face, torn in half
- **Animations**: Magnifying glass movement, floating elements
- **Background**: Blue gradient with transparent circles
- **Actions**: Refresh, Add New Item, Go Home buttons
- **Dark Mode**: Full dark mode support

### Server Error Page
- **Illustration**: Gray server with green error screen
- **Animations**: Status lights blinking, sparks, floating error messages
- **Background**: Red gradient with transparent circles
- **Actions**: Try Again and Go Home buttons
- **Dark Mode**: Full dark mode support

## Testing

### Manual Testing
1. Visit `/error-demo` to see all error pages
2. Try accessing non-existent URLs to trigger 404
3. Test admin error pages by visiting `/admin/non-existent`

### Automatic Testing
- 404 errors are automatically caught by Next.js
- Server errors are automatically caught by Next.js
- Admin routes have their own error handling

## Customization

### Props Available
Each error component accepts props for customization:

```typescript
// 404 Error
<Error404 
  title="Custom Title"
  message="Custom message"
  showBackButton={true}
  backUrl="/custom-url"
/>

// No Data Error
<NoDataError 
  title="Custom Title"
  message="Custom message"
  showRefreshButton={true}
  showAddButton={true}
  onRefresh={() => {}}
  onAdd={() => {}}
  addButtonText="Custom Button"
/>

// Server Error
<ServerError 
  title="Custom Title"
  message="Custom message"
  showRefreshButton={true}
  onRefresh={() => {}}
  errorCode="500"
/>
```

## Responsive Design
- All error pages are fully responsive
- Mobile-first design approach
- Touch-friendly buttons and interactions
- Optimized for all screen sizes

## Dark Mode Support
- All error pages support dark mode
- Automatic theme detection
- Consistent color schemes
- Smooth theme transitions

## Performance
- Optimized animations with Framer Motion
- Minimal bundle size impact
- Fast loading times
- Smooth user experience
