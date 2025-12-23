# Style & Vibe Guides Data

This directory contains the `styleVibeGuides.json` file, which defines 65 unique areas/locations in the BaddieLand RPG world.

## File: styleVibeGuides.json

**Purpose**: Seed data for the Firebase Firestore `styleVibeGuides` collection.

**Collection Name**: `styleVibeGuides`

**Document Count**: 65

**Document Structure**:
- `id` (string): Unique identifier in kebab-case
- `name` (string): Display name of the area
- `visualDescription` (string): Detailed visual description for design reference
- `keyPalette` (array of strings): Hex color codes defining the area's color scheme
- `activities` (array of strings): List of activities that occur in this area

## Areas Included

The collection includes diverse locations spanning multiple themes:

### Major Locations
- The Green Grotto - Rural travelling community hub
- The Misty Mountains - Luxury lodge and quarry
- Bubble Brook - Urban canal fashion district
- Cobble Cross - Central hub marketplace

### Landmarks
- The Whisper Kiosk - Gossip and rumor trading booth
- The Receipt Tree - Deal-making landmark
- The Blue Beanstalk - Giant iconic beanstalk
- Grimstone Gate - Imposing stone gateway

### Natural Areas
- Fairyglade - Bright woodland glade
- Whispering Woods - Dark forest pocket
- Painted Prairie - Colorful flat prairie
- Mushroom Meadows - Diverse mushroom landscape

### Settlements & Buildings
- Candlewax Palace - Colorful wax palace
- Thimblebrook Keep - Miniature-logic keep
- Wishing Well Ward - Courtyard town built around wells
- Trollbridge Toll Bridge - Classic fairy-tale crossing

### Markets & Commerce
- Clattermarket - Inter-faction bazaar
- Moonlit Market - Night market
- Lost & Fable Found - Pawn shop of story-items

### Roads & Paths
- Willowwisp Way - Winding path between regions
- Radgey Road - Road with attitude
- Robbers Road - Notorious bandit road
- Yodel Yarns - Musical stone steps

### Dangerous Areas
- Direwood - Danger-coded woods
- Grimwood - Heavy storybook scary forest
- The Treacherous Trees - Forest of trap-like shapes
- Nightshade Nook - Shadowy poisonous corner

### Comedic/Unusual Locations
- Ogre Fart Falls - Comic waterfall
- Sobby Sadlands - Comedic melancholy plains
- Muddybottom Marsh - Comical marsh
- Spite Spittle - Nasty little spot

### Industrial/Urban Areas
- Muggy Mines - Open-cut mine pits
- Sleepy Slaglands - Drowsy industrial flats
- Ink Lane - Printing lane
- Poison Pumpkin Posse Territory - Brutalist estate courtyards

### Water Features
- Witch's Wharf - Witchy craft docks
- Brimstone Bank - Scorched riverbank
- Rainbow Riverbank - Cheerful painted riverbank
- Little Cock o' Loch - Small loch with tartan bunting
- Log Lake - Lake with log cabins and rafts

### Unique Zones
- The Seams - Grid land with different biomes per square
- The Woodless Woods - Forest without trees
- Faelight Fen - Bright fen with glowing reeds
- Fat Fae Fields - Plump fae-themed fields

### Entertainment & Social
- Candyland Carnival - Fairground made of sweets
- Dead Divas Disco - Undead glamour club
- Pixie Parlor - Cosy taproom
- The Broken Oath - Tavern landmark

### Residential Areas
- WonkyWood Welcome World - Storybook estate
- Dummy Slummy Dumblands - Tacky fairytale estate
- Little Thing Lodges - Tiny lodge cluster
- Magic Madhousd - Chaotic magical oddhouse

### Strange Lands
- The Angerlands - Hot-tempered landscape
- The Mjngerlands - Gritty-comic grime land
- The Stuck Uplands - Everything snagged and jammed
- Peepy Tomlands - Voyeur-comedy moorlands

### Additional Areas
- Fangbang Fields - Vampire/were-creature themed fields
- Nymph's Nook - Lush water-meadow
- Ponsey Palace - Obvious scam-palace
- Blue Ball Butchers - Butcher shop landmark
- Fat Friend Falls - Friendly comedy waterfall
- Mike's Mucky Mansion - Filthy showpiece mansion
- Olaf's Opening - Bright clearing waypoint
- Ya Mas Wetlands - Cheeky playful wetlands
- Fairyglade Feasting Hall - Big timber hall in the glade

## Usage

See [docs/seeding.md](../docs/seeding.md) for instructions on how to:
- Set up Firebase credentials
- Seed this data into Firestore
- Verify the imported data
- Validate the JSON structure

## Scripts

- `npm run seed:style-vibes` - Import data to Firebase
- `npm run seed:style-vibes:dry` - Validate without importing
- `npm run validate:json` - Validate JSON structure locally
- `npm run verify:style-vibes` - Verify data in Firebase

## Data Integrity

- All 65 documents have unique IDs
- All hex colors are validated as 6-digit hex codes
- All required fields (id, name, visualDescription, keyPalette, activities) are present
- All arrays contain at least one element
- No duplicate IDs exist in the dataset
