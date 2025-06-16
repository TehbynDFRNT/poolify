# Investigation: AFE Item 6 - Tree Removal Field Failed to Send

## Issue Summary
The "AFE - Item 6 - Tree Removal" field failed to send in the contract submission. This field maps to `payload.contract_qa.site_details?.afe_item_6_tree_removal` in the webhook payload.

## Root Cause Analysis

### 1. Type Mismatch Between Database and Application Code

**Database Schema** (`docs/sitedetails.sql` line 13):
```sql
afe_item_6_tree_removal BOOLEAN, -- AFE - Item 6 - Tree Removal
```

**Application Code Expectations**:
- **TypeScript Interface** (`useContractSiteDetails.ts` line 19): `afe_item_6_tree_removal?: string; // R1 values (Yes/No/N/A)`
- **UI Component** (`ResponsibilitiesSection.tsx`): Uses R1_OPTIONS array with values `["Yes", "No", "N/A"]`
- **Webhook Submission** (`useContractSubmission.ts` line 192): Expects string values

### 2. Data Flow Issues

1. **Save Operation**: When users select "Yes", "No", or "N/A" in the UI, these string values cannot be properly stored in a BOOLEAN database field
2. **Load Operation**: When loading from database, boolean values (`true`/`false`/`null`) don't match the expected string format
3. **Submission**: Empty or incorrectly typed data results in missing field values in webhook payload

### 3. Similar Issues with Other Boolean Fields

The following fields in the same table have the same boolean/string type mismatch:
- `afe_crane_required` (should be R1_OPTIONS: "Yes"/"No"/"N/A")
- `afe_item_4_fnp_fences_near_access_path` (should be R1_OPTIONS: "Yes"/"No"/"N/A") 
- `afe_item_8_q4_service_relocation` (should be S1_OPTIONS: "Yes"/"No"/"Unknown")
- `afe_item_8_q6_material_left_on_site` (should be R1_OPTIONS: "Yes"/"No"/"N/A")
- `afe_item_8_q7_material_removed` (should be R1_OPTIONS: "Yes"/"No"/"N/A")

## Files Affected

### Database Schema
- `/docs/sitedetails.sql` - Original table definition with incorrect BOOLEAN types

### Application Code  
- `/src/components/contract/hooks/useContractSiteDetails.ts` - Handles CRUD operations with string expectations
- `/src/components/contract/qa-sections/ResponsibilitiesSection.tsx` - UI component for tree removal field
- `/src/components/contract/hooks/useContractSubmission.ts` - Webhook payload transformation
- `/src/components/contract/hooks/useContractDataCollection.ts` - Data collection orchestration
- `/src/types/contract-qa.ts` - Type definitions with R1_OPTIONS values

## Solution Implemented

Created `/docs/fix-sitedetails-table.sql` to:

1. **Convert boolean fields to VARCHAR with constraints**:
   - `afe_item_6_tree_removal`: BOOLEAN → VARCHAR(3) with CHECK constraint for ('Yes', 'No', 'N/A')
   - Similar fixes for other affected boolean fields

2. **Data migration logic**:
   - `true` → 'Yes'
   - `false` → 'No' 
   - `null` → `null` (unchanged)

3. **Add proper constraints** to ensure data integrity

## Field Mapping Verification

The webhook submission correctly maps the field:
```typescript
// Line 192 in useContractSubmission.ts
"AFE - Item 6 - Tree Removal": payload.contract_qa.site_details?.afe_item_6_tree_removal || "",
```

All other AFE fields are properly implemented and should work correctly once the database schema is fixed.

## Next Steps

1. **Execute the database fix**: Run `/docs/fix-sitedetails-table.sql` against the database
2. **Test the fix**: Verify that tree removal and other affected fields can be:
   - Saved correctly from the UI
   - Loaded correctly into the UI
   - Submitted correctly in webhook payload
3. **Monitor for similar issues**: Check other contract Q&A sections for similar boolean/string mismatches

## Prevention

- **Type Safety**: Ensure database schema matches TypeScript interface definitions
- **Validation**: Add database constraints that match application validation rules
- **Testing**: Test the complete data flow (save → load → submit) for all form fields
- **Documentation**: Keep schema documentation synchronized with application code

## Related Files

### Core Implementation
- `src/components/contract/qa-sections/ResponsibilitiesSection.tsx` - Main UI component
- `src/components/contract/hooks/useContractSiteDetails.ts` - Data persistence layer
- `src/components/contract/hooks/useContractSubmission.ts` - Webhook submission (line 192)

### Database  
- `docs/sitedetails.sql` - Original schema (incorrect)
- `docs/fix-sitedetails-table.sql` - Fix script (solution)

### Types
- `src/types/contract-qa.ts` - Interface definitions and option arrays