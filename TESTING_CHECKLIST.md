# Character Console - Testing Checklist

## Pre-Testing Setup

- [ ] Firebase project created and configured
- [ ] Environment variables set in `.env.local`
- [ ] Dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)
- [ ] Admin user created in Firebase Authentication
- [ ] Admin user added to `admins` collection in Firestore
- [ ] Firestore rules deployed
- [ ] Storage rules deployed

## Basic UI Tests

### Navigation
- [ ] Home page loads correctly
- [ ] Navigation bar displays "BaddieLand Character Console"
- [ ] "Home" and "Character Editor" links are visible
- [ ] Clicking "Home" navigates to home page
- [ ] Clicking "Character Editor" navigates to editor page

### Character Editor Layout
- [ ] Left sidebar displays correctly
- [ ] Center panel displays correctly
- [ ] Right sidebar (Asset Manager) displays correctly
- [ ] Layout is responsive on different screen sizes
- [ ] Dark mode theme is applied correctly

## Character Management Tests

### Create New Character
- [ ] Click "Create New Character" button
- [ ] Modal opens with confirmation
- [ ] Click "Create" button
- [ ] New character appears in form with default values
- [ ] Character ID is auto-generated
- [ ] Default gang is "GGG"
- [ ] Default species is "human"
- [ ] Default role is "bruiser"
- [ ] Default growth curve is "steady"
- [ ] Default MaT tags include "living" and "sentient"

### Load Existing Character
- [ ] Character dropdown shows list of characters
- [ ] Select a character from dropdown
- [ ] Character data loads in form
- [ ] All tabs display correct data
- [ ] Asset panel shows character's current assets

### Save Character
- [ ] Edit character name
- [ ] Click "Save Character" button
- [ ] Toast notification shows "Character saved successfully"
- [ ] Changes persist after page reload
- [ ] Keyboard shortcut (Ctrl+S) saves character

### Delete Character
- [ ] Select a character
- [ ] Click "Delete Character" button
- [ ] Confirmation modal appears
- [ ] Click "Cancel" - character is not deleted
- [ ] Click "Delete" again
- [ ] Click "Delete" in modal
- [ ] Character is removed from dropdown
- [ ] Toast notification shows success

## Form Field Tests

### Tab 1: Basic Info
- [ ] ID field is read-only
- [ ] Name field is editable
- [ ] Age field accepts numbers and text
- [ ] Gang dropdown shows: GGG, MMM, BBB, PPP
- [ ] Species dropdown shows all species groups
- [ ] Subspecies field is editable
- [ ] All changes update character state

### Tab 2: Visual Description
- [ ] Body and Skin textarea is editable
- [ ] Hair textarea is editable
- [ ] Clothing textarea is editable
- [ ] Distinguishing Features textarea is editable
- [ ] Weapon/Item field is editable
- [ ] Specific Visuals textarea is editable
- [ ] Text persists when switching tabs

### Tab 3: Roles & Growth
- [ ] Primary Role dropdown shows all 12 roles
- [ ] Secondary Role dropdown shows all roles + "None"
- [ ] Tertiary Role dropdown shows all roles + "None"
- [ ] Growth Curve dropdown shows all 6 curves
- [ ] Selections update character state

### Tab 4: Tags & Conditions
- [ ] All 25 MaT tags are displayed as checkboxes
- [ ] Checking a tag adds it to character
- [ ] Unchecking a tag removes it from character
- [ ] Hovering over tag shows description (if implemented)
- [ ] Multiple tags can be selected

### Tab 5: Level Stats
- [ ] Stats table shows levels 1-10
- [ ] All 19 stat fields are visible
- [ ] Level field is read-only
- [ ] All other stat fields are editable
- [ ] Number inputs accept values 1-100 for combat stats
- [ ] XPA and XPT can be larger values
- [ ] "Generate Stats" button works
- [ ] Generated stats follow growth curve pattern
- [ ] Changes persist when switching tabs

### Tab 6: Moves
- [ ] Move list displays character's moves
- [ ] "Add Move" button opens move editor
- [ ] Each move shows: name, type, target, level
- [ ] "Edit" button opens move editor with move data
- [ ] "Delete" button removes move from character

## Move Editor Tests

### Open Move Editor
- [ ] Click "Add Move" button
- [ ] Move editor modal opens
- [ ] Form fields are empty (for new move)
- [ ] Click "Edit" on existing move
- [ ] Move editor opens with move data

### Move Form Fields
- [ ] Move ID field is read-only
- [ ] Name field is editable
- [ ] Description textarea is editable
- [ ] Type dropdown shows all move types
- [ ] Target Type dropdown shows all target options
- [ ] Target Count field accepts numbers
- [ ] Learned at Level accepts 1-10
- [ ] Effect Algorithm textarea is editable

### MaT Multipliers
- [ ] Click "Add MaT" button
- [ ] New MaT row appears
- [ ] Tag dropdown shows all tags
- [ ] Multiplier field accepts decimal numbers
- [ ] "Remove" button deletes MaT
- [ ] Multiple MaTs can be added

### MaEC Multipliers
- [ ] Click "Add MaEC" button
- [ ] New MaEC row appears
- [ ] Condition dropdown shows all conditions
- [ ] Multiplier field accepts decimal numbers
- [ ] "Remove" button deletes MaEC
- [ ] Multiple MaECs can be added

### Save and Close
- [ ] Click "Save Move" button
- [ ] Move is saved to Firestore
- [ ] Move appears in character's move list
- [ ] Modal closes
- [ ] Click "Cancel" button
- [ ] Modal closes without saving
- [ ] Press Esc key
- [ ] Modal closes

## Asset Manager Tests

### Avatar Section
- [ ] Current avatar displays (if exists)
- [ ] "No avatar" message shows if none
- [ ] Click "Generate New Avatar" button
- [ ] Button shows "Generating..." state
- [ ] Toast notification appears (placeholder)
- [ ] Drafts section says "Drafts will appear here"

### Sprite Sheet Section
- [ ] Current sprite sheet displays (if exists)
- [ ] "No sprite sheet" message shows if none
- [ ] Template type displays correctly
- [ ] Feedback textarea is editable
- [ ] Click "Generate Sprite Sheet" button
- [ ] Button shows "Generating..." state
- [ ] Toast notification appears (placeholder)
- [ ] Drafts section says "Drafts will appear here"

### Tile Atlas Section
- [ ] "Generate Tile Atlas" button is disabled without sprite sheet
- [ ] Warning message shows "Generate a sprite sheet first"
- [ ] With sprite sheet, button is enabled
- [ ] Click "Generate Tile Atlas" button
- [ ] Button shows "Generating..." state
- [ ] Toast notification appears (placeholder)

## Filter and Search Tests

### Gang Filter
- [ ] Gang filter dropdown shows: All Gangs, GGG, MMM, BBB, PPP
- [ ] Select "GGG" filter
- [ ] Character dropdown shows only GGG characters
- [ ] Select "All Gangs"
- [ ] All characters are visible again

### Template Selection
- [ ] Template dropdown shows: Walker Swim, Walker Swim Fly, Hover Flying, Constant Motion FX
- [ ] Selecting template updates state
- [ ] Selected template is used in Asset Manager

## Keyboard Shortcuts

- [ ] Press Ctrl+S (Cmd+S on Mac)
- [ ] Character is saved
- [ ] Toast notification appears
- [ ] Press Esc with modal open
- [ ] Modal closes

## Error Handling

### Validation Errors
- [ ] Try to save character without required fields
- [ ] Validation errors should appear (to be implemented)
- [ ] Fill in required fields
- [ ] Character saves successfully

### Network Errors
- [ ] Disconnect from internet
- [ ] Try to save character
- [ ] Error toast should appear
- [ ] Reconnect to internet
- [ ] Operation should work

### Firebase Errors
- [ ] Test with invalid Firebase credentials
- [ ] Error messages should be helpful
- [ ] Fix credentials
- [ ] App should work normally

## Loading States

- [ ] Loading spinner shows when fetching characters
- [ ] Button shows "Saving..." when saving
- [ ] Button shows "Generating..." when generating assets
- [ ] Loading states prevent duplicate operations

## Toast Notifications

- [ ] Success toast is green/positive
- [ ] Error toast is red/negative
- [ ] Toast auto-dismisses after 3 seconds
- [ ] Toast appears in bottom-right corner
- [ ] Multiple toasts don't overlap

## Browser Compatibility

- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] All features work in all browsers

## Mobile/Responsive Tests

- [ ] Test on tablet size (768px)
- [ ] Test on mobile size (375px)
- [ ] Layout adjusts appropriately
- [ ] All features are accessible
- [ ] Touch interactions work

## Performance Tests

- [ ] App loads in under 3 seconds
- [ ] Switching tabs is instant
- [ ] Filtering characters is fast
- [ ] No console errors or warnings
- [ ] No memory leaks (check browser DevTools)

## Accessibility Tests

- [ ] All buttons have clear labels
- [ ] Form fields have labels
- [ ] Tab navigation works
- [ ] Color contrast is sufficient
- [ ] Screen reader compatibility (if possible)

## Integration Tests (When OpenAI is implemented)

- [ ] Generate avatar produces image
- [ ] Image is uploaded to Firebase Storage
- [ ] Image URL is saved to character
- [ ] Draft management works
- [ ] Finalize draft moves to permanent storage
- [ ] Generate sprite sheet produces image
- [ ] Generate tile atlas produces PNG and JSON
- [ ] Atlas metadata is correct

## Data Persistence Tests

- [ ] Create character and save
- [ ] Refresh page
- [ ] Character still exists
- [ ] Edit character and save
- [ ] Refresh page
- [ ] Changes are persisted
- [ ] Delete character
- [ ] Refresh page
- [ ] Character is still deleted

## Edge Cases

- [ ] Create character with very long name (100+ chars)
- [ ] Create character with special characters in name
- [ ] Set level stats to min values (1)
- [ ] Set level stats to max values (100)
- [ ] Add 20+ MaT tags
- [ ] Add 20+ moves
- [ ] Try to load non-existent character
- [ ] Rapid clicking buttons doesn't cause errors

## Security Tests

- [ ] Non-admin user cannot access editor (if auth is set up)
- [ ] Cannot save to Firestore without admin permission
- [ ] Cannot upload to Storage without admin permission
- [ ] Firebase rules are enforced

## Known Limitations (Expected Behavior)

- [ ] Asset generation shows placeholder toast (not implemented)
- [ ] Draft management UI shows "will appear here" (not implemented)
- [ ] OpenAI integration not functional (placeholder)
- [ ] Image processing not functional (placeholder)
- [ ] Atlas generation returns empty buffer (placeholder)

## Test Results Summary

**Date Tested**: _________________
**Tester**: _________________
**Environment**: 
- [ ] Development
- [ ] Production

**Overall Status**:
- [ ] Pass
- [ ] Pass with issues
- [ ] Fail

**Issues Found**: _________________

**Notes**: _________________
