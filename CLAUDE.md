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

## Adding New Data Inputs to Site Requirements

This guide provides a comprehensive step-by-step process for adding new data inputs to the Site Requirements section. Follow these steps to properly integrate new fields from database to frontend.

### Overview of Site Requirements Architecture

The Site Requirements feature uses a multi-layered architecture:
1. **Database Layer**: Stores data in `pool_projects` and `pool_equipment_selections` tables
2. **Hook Layer**: `useSiteRequirements` manages data fetching and state
3. **Component Layer**: Form components handle user interaction
4. **Save Layer**: `useSiteRequirementsGuarded` handles data persistence

### Step 1: Database Schema Updates

#### For Equipment-Type Selections (with reference tables):
If adding a new equipment selection (like crane, bobcat, traffic control):

1. **Create a new reference table**:
```sql
CREATE TABLE new_equipment_costs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

2. **Add column to pool_equipment_selections**:
```sql
ALTER TABLE pool_equipment_selections 
ADD COLUMN new_equipment_id UUID REFERENCES new_equipment_costs(id);
```

#### For Simple Data Fields:
If adding simple fields (text, numbers, booleans):

1. **Add to pool_projects table**:
```sql
ALTER TABLE pool_projects 
ADD COLUMN site_new_field_data TEXT; -- or appropriate type
```

### Step 2: Update TypeScript Types

1. **Generate new types** (if Supabase types are auto-generated):
```bash
npm run generate-types
```

2. **Or manually update types** in relevant files:
```typescript
// In your types file
export interface PoolEquipmentSelection {
  // ... existing fields
  new_equipment_id?: string | null;
}
```

### Step 3: Update the useSiteRequirements Hook

Location: `/src/hooks/useSiteRequirements.ts`

1. **Add state for new field**:
```typescript
const [newEquipmentId, setNewEquipmentId] = useState<string | undefined>('none');
const [newEquipmentCost, setNewEquipmentCost] = useState<number>(0);
```

2. **Update the fetch query** to include new fields:
```typescript
const { data, error } = await supabase
  .from('pool_projects')
  .select(`
    site_requirements_data,
    site_requirements_notes,
    site_new_field_data,  // Add new field
    pool_equipment_selections(
      crane_id,
      traffic_control_id,
      bobcat_id,
      new_equipment_id  // Add new equipment field
    )
  `)
  .eq('id', customerId)
  .single();
```

3. **Set state from fetched data**:
```typescript
if (data) {
  const equipmentData = getFirstOrEmpty(data.pool_equipment_selections);
  // ... existing setters
  setNewEquipmentId(equipmentData.new_equipment_id || 'none');
}
```

4. **Add cost fetching** (for equipment with costs):
```typescript
// In the costs useEffect
if (newEquipmentId && newEquipmentId !== 'none') {
  const { data: newEquipmentData } = await supabase
    .from('new_equipment_costs')
    .select('price')
    .eq('id', newEquipmentId)
    .single();
  
  if (newEquipmentData) {
    setNewEquipmentCost(newEquipmentData.price);
  }
} else {
  setNewEquipmentCost(0);
}
```

5. **Update total cost calculation**:
```typescript
const totalCost = craneCost + trafficControlCost + bobcatCost + newEquipmentCost + customRequirementsTotal;
```

6. **Return new state and setters**:
```typescript
return {
  // ... existing returns
  newEquipmentId,
  setNewEquipmentId,
  newEquipmentCost,
};
```

### Step 4: Create New Selector Component

For equipment selections, create a new selector component:

Location: `/src/components/pool-builder/pool-selection/components/site-requirements/NewEquipmentSelector.tsx`

```typescript
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { YourIcon } from "lucide-react";

interface NewEquipmentSelectorProps {
  equipmentId: string | undefined;
  onEquipmentChange: (equipmentId: string) => void;
}

export const NewEquipmentSelector: React.FC<NewEquipmentSelectorProps> = ({ 
  equipmentId, 
  onEquipmentChange 
}) => {
  const { data: equipmentOptions, isLoading } = useQuery({
    queryKey: ["new-equipment-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("new_equipment_costs")
        .select("*")
        .order("display_order");
      
      if (error) {
        console.error("Error fetching equipment costs:", error);
        return [];
      }
      
      return data;
    }
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">New Equipment Selection</CardTitle>
          <YourIcon className="h-5 w-5 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="new-equipment">Select Equipment Type</Label>
            <Select 
              value={equipmentId || "none"} 
              onValueChange={onEquipmentChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select equipment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None Required</SelectItem>
                {equipmentOptions?.map(equipment => (
                  <SelectItem key={equipment.id} value={equipment.id}>
                    {equipment.name} - ${equipment.price.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

### Step 5: Update SiteRequirementsSection Component

Location: `/src/components/pool-builder/pool-selection/components/site-requirements/SiteRequirementsSection.tsx`

1. **Import new selector**:
```typescript
import { NewEquipmentSelector } from "./NewEquipmentSelector";
```

2. **Add props**:
```typescript
interface SiteRequirementsSectionProps {
  // ... existing props
  newEquipmentId: string | undefined;
  onNewEquipmentChange: (equipmentId: string) => void;
}
```

3. **Add selector to render**:
```typescript
<NewEquipmentSelector
  equipmentId={newEquipmentId}
  onEquipmentChange={onNewEquipmentChange}
/>
```

### Step 6: Update Parent Components

Update the prop drilling through StandardRequirementsSection and SiteRequirementsForm to pass the new data and handlers.

### Step 7: Update CostSummarySection

Add the new cost to the summary display:

```typescript
{newEquipmentCost > 0 && (
  <div className="flex justify-between">
    <span>New Equipment:</span>
    <span>${newEquipmentCost.toFixed(2)}</span>
  </div>
)}
```

### Step 8: Update Save Hook

Location: `/src/hooks/useSiteRequirementsGuarded.ts`

1. **Update form data interface**:
```typescript
interface SiteRequirementsFormData {
  // ... existing fields
  newEquipmentId: string;
}
```

2. **Update save logic**:
```typescript
const updateData = {
  // ... existing fields
  new_equipment_id: formData.newEquipmentId === 'none' ? null : formData.newEquipmentId
};
```

### Step 9: Update Form Save Handler

In `SiteRequirementsForm.tsx`, update the save handler:

```typescript
const handleSaveRequirements = () => {
  onSave({
    // ... existing fields
    newEquipmentId,
  });
};
```

### Best Practices

1. **Naming Conventions**:
   - Database columns: `snake_case`
   - TypeScript properties: `camelCase`
   - Component names: `PascalCase`
   - File names: Match component names

2. **Error Handling**:
   - Always handle database errors gracefully
   - Provide user feedback via toast notifications
   - Log errors to console for debugging

3. **Performance**:
   - Use React Query for caching reference data
   - Minimize re-renders with proper dependencies
   - Consider memoization for expensive calculations

4. **Testing**:
   - Test database queries in Supabase dashboard first
   - Verify TypeScript types are correct
   - Test edge cases (null values, empty selections)

5. **UI Consistency**:
   - Follow existing card and form patterns
   - Use consistent spacing and styling
   - Maintain responsive design

### Common Pitfalls to Avoid

1. **Forgetting to handle 'none' values** - Always check for 'none' and convert to null for database
2. **Not updating total calculations** - Remember to include new costs in totals
3. **Missing TypeScript types** - Ensure all new fields have proper types
4. **Forgetting to update save logic** - Both read and write operations must be updated
5. **Not following existing patterns** - Consistency is key for maintainability

## Notes
- The project uses Bun as the JavaScript runtime (see bun.lockb)
- Supabase Edge Functions are present (see /supabase/functions/)
- Custom SQL procedures may exist (see /src/utils/database/)
- App title format: "Poolify CPQ - [Page Name]"
- Favicon and app icons configured for all platforms