# Poolify Project Guidelines

## Project Overview
Poolify CPQ (Configure, Price, Quote) is a comprehensive pool sales and project management system built with React, TypeScript, and Supabase. The application manages customer relationships, pool specifications, quotes, and contracts through an integrated workflow.

## Key Architecture Patterns

### Database Structure
- **pool_projects**: Main customer/project table containing owner details, addresses, and project metadata
- **pool_proposal_status**: Tracks proposal lifecycle (created → sent → viewed → accepted/change_requested)
- **pool_specifications**: Pool model definitions and pricing
- Uses Supabase for backend with TypeScript types generated from database schema

### UI Components
- Using shadcn/ui component library (components in `/src/components/ui/`)
- Tailwind CSS for styling with custom utility classes
- Responsive design patterns: mobile-first with breakpoints (sm, md, lg, xl)
- Consistent header components across all pages with breadcrumb navigation
- Collapsible sidebar with logo display when compressed

### State Management
- React Query (@tanstack/react-query) for server state
- Custom hooks pattern for data fetching (e.g., `useSnapshots`, `useCustomerData`)
- Local state with useState for UI interactions
- localStorage for persisting UI preferences (e.g., navigation expansion state)
- Dynamic page titles using custom `usePageTitle` hook

## Development Patterns

### Date Handling
- Dates stored as ISO strings in database
- Format dates for display using `toLocaleDateString()` and `toLocaleTimeString()`
- Status-specific date fields: `last_viewed`, `last_change_requested`, `accepted_datetime`

### Status Flow
The proposal status progression:
1. **created** - Initial state (gray styling)
2. **sent** - Proposal sent to customer (blue styling)
3. **viewed** - Customer viewed proposal (teal styling)
4. **accepted** - Proposal accepted (green styling)
5. **change_requested** - Customer requested changes (red/destructive styling)

All status badges are prefixed with "Proposal" for clarity (e.g., "Proposal Created", "Proposal Sent")

### Component Patterns
- Use compound components for complex UI (e.g., Select with SelectTrigger, SelectContent, SelectItem)
- Responsive button layouts with `flex-wrap` and minimum widths
- Card-based layouts with consistent padding (`p-6`)

### Navigation Structure
- Main navigation order: Customers, Pool Builder, Contract Builder, Cost Builder
- Cost Builder has collapsible sub-items (Pool Creation Wizard, Pool Specifications, Construction Costs, Third Party Costs, Filtration Systems, Add-Ons, Pool Worksheet, Formula References)
- Pool Builder and Contract Builder share similar structure but serve different purposes
- Contract Builder is only accessible when proposal status is "accepted"
- Use query parameters for passing customer IDs between pages
- Navigation items have consistent hover effects (darker background and text)

## Common Tasks

### Adding Status-Based Features
When implementing status-dependent UI:
1. Fetch from `pool_proposal_status` table
2. Map status to appropriate styling/icons
3. Consider the full lifecycle when displaying information
4. Use conditional logic for feature access (e.g., Contract Builder only when status is "accepted")

### Working with Customer Data
- Always fetch both `pool_projects` and `pool_proposal_status` for complete information
- Handle cases where status records don't exist (default to 'created')
- Use Maps for efficient data lookup when dealing with multiple records
- Display status-appropriate dates (e.g., viewed date when status is "viewed")

### Responsive Design Considerations
- Test button wrapping at various screen sizes
- Use `min-w-[value]` to control when elements wrap
- Consider mobile view for all new features
- Maintain consistent spacing and padding across pages

### Creating Consistent Page Headers
When creating new pages:
1. Create a dedicated header component (e.g., `PageNameHeader.tsx`)
2. Include breadcrumb navigation: Home → Parent Section → Current Page
3. Add title and descriptive subtitle
4. Use consistent container: `max-w-7xl mx-auto py-8 px-4`
5. Optional: Add relevant icon to the right of the header

## Testing Commands
Based on package.json, the following commands are available:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (should be run before committing)
- `npm run typecheck` - Check TypeScript types

## Areas for Future Investigation
- Authentication flow and protected routes
- Pool specification pricing calculations
- Filtration system matching logic
- Contract vs Quote differences in business logic
- Integration with external services (if any)

## Style Guide

### Button Styling
- Primary buttons: Default shadcn/ui styling
- Outline buttons: Use explicit hover states to prevent unwanted color changes
- Disabled buttons: Add `disabled:opacity-50 disabled:cursor-not-allowed`
- Button groups: Use `flex-wrap` with `min-w-[240px]` for responsive layouts

### Navigation Styling
- Active items: Primary background with white text
- Hover states: `hover:bg-gray-200 hover:text-gray-800`
- Sub-items: No indentation, same styling as parent items
- Collapse/expand button: Located at bottom of sidebar with border separator

### Status Badge Colors
- Created: Gray (`bg-gray-300 text-gray-800`)
- Sent: Blue (`bg-blue-100 text-blue-800`)
- Viewed: Teal (`bg-teal-100 text-teal-800`)
- Accepted: Green (`bg-green-600 text-white`)
- Change Requested: Red/Destructive (default variant)

## Notes
- The project uses Bun as the JavaScript runtime (see bun.lockb)
- Supabase Edge Functions are present (see /supabase/functions/)
- Custom SQL procedures may exist (see /src/utils/database/)
- App title format: "Poolify CPQ - [Page Name]"
- Favicon and app icons configured for all platforms