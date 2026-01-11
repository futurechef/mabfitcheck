# MAB Virtual Atelier - Data Integration Plan

## Current State Analysis

### ✅ What's Working
1. **Suits Catalog** - 31 suits fully defined in `constants.ts` with:
   - Cloud storage image URLs
   - Complete metadata (color, pattern, fabric type, mill, etc.)
   - AI prompt descriptions for generation
   - Product URLs linking to MAB website

2. **Basic Shirt Flow** - Hardcoded style options (collar, cuff) working

3. **AI Integration** - Gemini 3 Pro Image integration deployed

### ❌ What Needs Fixing

#### 1. Shirt Fabric Data (Priority: HIGH)
**Problem:** `fabricSwatches.ts` has only 5 placeholder entries using Unsplash stock images
**Source:** YAML catalog shows 112 real fabric swatches in cloud storage organized by mill:
- Holland & Sherry (30 swatches)
- Scabal (24 swatches)  
- Dormeuil (14 swatches)
- Loro Piana (3 swatches)
- Other mills (41 swatches)

**Action Items:**
- [ ] Map YAML fabric_swatches to TypeScript constants
- [ ] Add mill name to FabricSwatch interface
- [ ] Use real cloud storage URLs: `https://storage.googleapis.com/mabbucket/MABSUITapp/fabric_swatches/`
- [ ] Create mill categories for filtering UI

#### 2. Fabric Texture Images (Priority: MEDIUM)
**Problem:** High-res fabric textures (44 files) not integrated
**Source:** `https://storage.googleapis.com/mabbucket/MABSUITapp/fabric_images/`

**Action Items:**
- [ ] Link fabric_images to suit data for detail views
- [ ] Add `fabricImageUrl` field to SuitData type
- [ ] Show texture zoom in ProductDetailsModal

#### 3. Shirt Product Data (Priority: HIGH)
**Problem:** No actual shirt products defined - just style configurations
**Source:** Need to define actual shirt products with:
- Names, prices, production times
- Compatible fabric options
- AI prompt descriptions

**Action Items:**
- [ ] Create SHIRTS constant array mirroring suit structure
- [ ] Define ShirtData type similar to SuitData
- [ ] Update GarmentTypeSelector to show actual products

#### 4. Type Alignment (Priority: MEDIUM)
**Problem:** FabricSwatch interface missing fields from YAML
**Current Fields:** id, name, imageUrl, pattern, color
**Missing Fields:** mill, weight, price_tier, composition

**Action Items:**
- [ ] Extend FabricSwatch interface
- [ ] Add mill-based filtering to ShirtFabricSelector

---

## Implementation Phases

### Phase 1: Fabric Swatches (Immediate)
Populate `fabricSwatches.ts` with real data from cloud storage

```typescript
// Target structure
export interface FabricSwatch {
    id: string;
    name: string;
    mill: 'Holland & Sherry' | 'Scabal' | 'Dormeuil' | 'Loro Piana' | 'Other';
    imageUrl: string;
    pattern: string;
    color: string;
    weight?: string;
    price_tier?: 'Standard' | 'Premium' | 'Luxury';
}
```

### Phase 2: Link Fabrics to Suits
Add fabric detail images to suit products for zoom views

### Phase 3: Shirt Products
Create actual shirt product catalog with pricing

### Phase 4: Cross-Linking
- Suggest compatible shirt/suit pairings
- Show "Complete the Look" recommendations

---

## Data Relationships

```
Suits (31 products)
  └── fabricMill: string (already defined)
  └── fabricType: string (already defined)
  └── ADD: fabricSwatchId: string (link to swatch)

Fabric Swatches (112 items)
  └── Used by: Shirt customization
  └── Link to: Fabric Images (44 hi-res textures)

Shirts (TBD products)
  └── compatibleFabrics: FabricSwatch[]
  └── compatibleSuits: SuitData[] (for "Complete Look")
```

---

## Quick Wins (Can Do Now)

1. **Add mill-based filtering** to existing fabric selector
2. **Link to real fabric swatch images** from cloud storage
3. **Add "View on MAB Website"** button in ProductDetailsModal using productUrl

---

## Questions for User

1. **Shirts:** Do you want pre-defined shirt products (e.g., "Classic White Dress Shirt $395") or keep the current "configure your own" approach?

2. **Fabric-to-Suit linking:** Should each suit show its specific fabric swatch, or keep fabrics as a separate selection?

3. **Priority:** Start with fabrics (visual impact) or shirts (functional completeness)?
