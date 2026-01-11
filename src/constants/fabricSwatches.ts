
export type FabricMill = 'Holland & Sherry' | 'Scabal' | 'Dormeuil' | 'Loro Piana' | 'Other';

export interface ShirtStyle {
    collar: string;
    cuff: string;
    front: string;
    back: string;
}

export interface FabricSwatch {
    id: string;
    name: string;
    mill: FabricMill;
    imageUrl: string;
    pattern: string;
    color: string;
}

export interface ShirtConfiguration {
    style: ShirtStyle;
    fabric: FabricSwatch;
}

const BASE_URL = 'https://storage.googleapis.com/mabbucket/MABSUITapp/fabric_swatches/';

// ============================================================================
// HOLLAND & SHERRY (27 swatches)
// Premium English mill known for fine worsted wools
// ============================================================================
const HOLLAND_SHERRY: FabricSwatch[] = [
    { id: 'ESHS-9819600H', name: 'Midnight Navy Super 130s', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-9819600H.jpg`, pattern: 'Solid', color: 'Navy' },
    { id: 'ESHS-983503H', name: 'Charcoal Grey Herringbone', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-983503H.jpg`, pattern: 'Herringbone', color: 'Charcoal' },
    { id: 'ESHS-986001H', name: 'Classic Navy Twill', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986001H.jpg`, pattern: 'Twill', color: 'Navy' },
    { id: 'ESHS-986002H', name: 'Slate Grey Plain', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986002H.jpg`, pattern: 'Solid', color: 'Grey' },
    { id: 'ESHS-986006H', name: 'Oxford Blue Birdseye', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986006H.jpg`, pattern: 'Birdseye', color: 'Blue' },
    { id: 'ESHS-986007H', name: 'Steel Grey Sharkskin', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986007H.jpg`, pattern: 'Sharkskin', color: 'Grey' },
    { id: 'ESHS-986008H', name: 'Midnight Blue Pinhead', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986008H.jpg`, pattern: 'Pinhead', color: 'Navy' },
    { id: 'ESHS-986009H', name: 'Anthracite Grey Solid', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986009H.jpg`, pattern: 'Solid', color: 'Charcoal' },
    { id: 'ESHS-986010H', name: 'Medium Grey Flannel', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986010H.jpg`, pattern: 'Flannel', color: 'Grey' },
    { id: 'ESHS-986011H', name: 'Navy Blue Hopsack', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986011H.jpg`, pattern: 'Hopsack', color: 'Navy' },
    { id: 'ESHS-986018H', name: 'Light Grey Pick & Pick', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986018H.jpg`, pattern: 'Pick & Pick', color: 'Light Grey' },
    { id: 'ESHS-986024H', name: 'Dark Navy Gabardine', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986024H.jpg`, pattern: 'Gabardine', color: 'Navy' },
    { id: 'ESHS-986025H', name: 'Mid Grey Worsted', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986025H.jpg`, pattern: 'Solid', color: 'Grey' },
    { id: 'ESHS-986026H', name: 'Charcoal Pinstripe', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986026H.jpg`, pattern: 'Pinstripe', color: 'Charcoal' },
    { id: 'ESHS-986027H', name: 'Navy Chalk Stripe', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986027H.jpg`, pattern: 'Chalk Stripe', color: 'Navy' },
    { id: 'ESHS-986028H', name: 'Grey Glen Plaid', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986028H.jpg`, pattern: 'Glen Plaid', color: 'Grey' },
    { id: 'ESHS-986031H', name: 'Blue Windowpane', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986031H.jpg`, pattern: 'Windowpane', color: 'Blue' },
    { id: 'ESHS-986032H', name: 'Charcoal Nailhead', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986032H.jpg`, pattern: 'Nailhead', color: 'Charcoal' },
    { id: 'ESHS-986036H', name: 'Steel Blue Solid', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986036H.jpg`, pattern: 'Solid', color: 'Blue' },
    { id: 'ESHS-986500H', name: 'Black Super 120s', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986500H.jpg`, pattern: 'Solid', color: 'Black' },
    { id: 'ESHS-986501H', name: 'Midnight Twill', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986501H.jpg`, pattern: 'Twill', color: 'Navy' },
    { id: 'ESHS-986502H', name: 'Pearl Grey Herringbone', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986502H.jpg`, pattern: 'Herringbone', color: 'Light Grey' },
    { id: 'ESHS-986503H', name: 'Royal Blue Solid', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986503H.jpg`, pattern: 'Solid', color: 'Royal Blue' },
    { id: 'ESHS-986504H', name: 'Dove Grey Plain', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986504H.jpg`, pattern: 'Solid', color: 'Grey' },
    { id: 'ESHS-986505H', name: 'Navy Birdseye', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986505H.jpg`, pattern: 'Birdseye', color: 'Navy' },
    { id: 'ESHS-986506H', name: 'Silver Grey Sharkskin', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986506H.jpg`, pattern: 'Sharkskin', color: 'Silver' },
    { id: 'ESHS-986508H', name: 'Charcoal Super 150s', mill: 'Holland & Sherry', imageUrl: `${BASE_URL}ESHS-986508H.jpg`, pattern: 'Solid', color: 'Charcoal' },
];

// ============================================================================
// SCABAL (23 swatches)
// Belgian luxury mill famous for exclusive fabrics
// ============================================================================
const SCABAL: FabricSwatch[] = [
    { id: 'SSCA-852442', name: 'Midnight Navy Solid', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852442Scaba.jpg`, pattern: 'Solid', color: 'Navy' },
    { id: 'SSCA-852443', name: 'Charcoal Twill', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852443Scaba.jpg`, pattern: 'Twill', color: 'Charcoal' },
    { id: 'SSCA-852446', name: 'Oxford Grey Plain', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852446Scaba.jpg`, pattern: 'Solid', color: 'Grey' },
    { id: 'SSCA-852455', name: 'Navy Herringbone', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852455Scaba.jpg`, pattern: 'Herringbone', color: 'Navy' },
    { id: 'SSCA-852457', name: 'Medium Grey Birdseye', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852457Scaba.jpg`, pattern: 'Birdseye', color: 'Grey' },
    { id: 'SSCA-852462', name: 'Dark Navy Pinstripe', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852462Scaba.jpg`, pattern: 'Pinstripe', color: 'Navy' },
    { id: 'SSCA-852466', name: 'Steel Grey Sharkskin', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852466Scaba.jpg`, pattern: 'Sharkskin', color: 'Grey' },
    { id: 'SSCA-852467', name: 'Black Solid', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852467Scaba.jpg`, pattern: 'Solid', color: 'Black' },
    { id: 'SSCA-852468', name: 'Navy Blue Glen Plaid', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852468Scaba.jpg`, pattern: 'Glen Plaid', color: 'Navy' },
    { id: 'SSCA-852474', name: 'Charcoal Nailhead', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852474Scaba.jpg`, pattern: 'Nailhead', color: 'Charcoal' },
    { id: 'SSCA-852482', name: 'Light Grey Flannel', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852482Scaba.jpg`, pattern: 'Flannel', color: 'Light Grey' },
    { id: 'SSCA-852781', name: 'Royal Navy Super 130s', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852781Scaba.jpg`, pattern: 'Solid', color: 'Navy' },
    { id: 'SSCA-852782', name: 'Anthracite Grey Plain', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852782Scaba.jpg`, pattern: 'Solid', color: 'Charcoal' },
    { id: 'SSCA-852783', name: 'Medium Blue Solid', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852783Scaba.jpg`, pattern: 'Solid', color: 'Blue' },
    { id: 'SSCA-852784', name: 'Silver Grey Twill', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852784Scaba.jpg`, pattern: 'Twill', color: 'Silver' },
    { id: 'SSCA-852785', name: 'Navy Chalk Stripe', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852785Scaba.jpg`, pattern: 'Chalk Stripe', color: 'Navy' },
    { id: 'SSCA-852786', name: 'Charcoal Glen Check', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852786Scaba.jpg`, pattern: 'Glen Check', color: 'Charcoal' },
    { id: 'SSCA-852787', name: 'Dark Grey Herringbone', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852787Scaba.jpg`, pattern: 'Herringbone', color: 'Dark Grey' },
    { id: 'SSCA-852791', name: 'Navy Windowpane', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852791Scaba.jpg`, pattern: 'Windowpane', color: 'Navy' },
    { id: 'SSCA-852793', name: 'Charcoal Birdseye', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852793Scaba.jpg`, pattern: 'Birdseye', color: 'Charcoal' },
    { id: 'SSCA-852794', name: 'Pearl Grey Solid', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852794Scaba.jpg`, pattern: 'Solid', color: 'Light Grey' },
    { id: 'SSCA-852795', name: 'Ink Navy Gabardine', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852795Scaba.jpg`, pattern: 'Gabardine', color: 'Navy' },
    { id: 'SSCA-852806', name: 'Slate Grey Pick & Pick', mill: 'Scabal', imageUrl: `${BASE_URL}SSCA-852806Scaba.jpg`, pattern: 'Pick & Pick', color: 'Grey' },
];

// ============================================================================
// DORMEUIL (13 swatches)
// French luxury mill with 180+ years heritage
// ============================================================================
const DORMEUIL: FabricSwatch[] = [
    { id: 'ESDM-140005D', name: 'Classic Navy Super 150s', mill: 'Dormeuil', imageUrl: `${BASE_URL}ESDM-140005D.jpg`, pattern: 'Solid', color: 'Navy' },
    { id: 'ESDM-140006D', name: 'Charcoal Grey Super 150s', mill: 'Dormeuil', imageUrl: `${BASE_URL}ESDM-140006D.jpg`, pattern: 'Solid', color: 'Charcoal' },
    { id: 'ESDM-300001D', name: 'Midnight Navy Solid', mill: 'Dormeuil', imageUrl: `${BASE_URL}ESDM-300001D.jpg`, pattern: 'Solid', color: 'Navy' },
    { id: 'ESDM-300002D', name: 'Steel Grey Plain', mill: 'Dormeuil', imageUrl: `${BASE_URL}ESDM-300002D.jpg`, pattern: 'Solid', color: 'Grey' },
    { id: 'ESDM-300009D', name: 'Navy Blue Twill', mill: 'Dormeuil', imageUrl: `${BASE_URL}ESDM-300009D.jpg`, pattern: 'Twill', color: 'Navy' },
    { id: 'ESDM-300094D', name: 'Medium Grey Herringbone', mill: 'Dormeuil', imageUrl: `${BASE_URL}ESDM-300094D.jpg`, pattern: 'Herringbone', color: 'Grey' },
    { id: 'ESDM-301486D', name: 'Dark Navy Pinstripe', mill: 'Dormeuil', imageUrl: `${BASE_URL}ESDM-301486D.jpg`, pattern: 'Pinstripe', color: 'Navy' },
    { id: 'ESDM-470202D', name: 'Charcoal Sharkskin', mill: 'Dormeuil', imageUrl: `${BASE_URL}ESDM-470202D.jpg`, pattern: 'Sharkskin', color: 'Charcoal' },
    { id: 'ESDM-571784D', name: 'Light Grey Birdseye', mill: 'Dormeuil', imageUrl: `${BASE_URL}ESDM-571784D.jpg`, pattern: 'Birdseye', color: 'Light Grey' },
    { id: 'ESDM-572997D', name: 'Navy Glen Plaid', mill: 'Dormeuil', imageUrl: `${BASE_URL}ESDM-572997D.jpg`, pattern: 'Glen Plaid', color: 'Navy' },
    { id: 'ESDM-796002D', name: 'Oxford Grey Flannel', mill: 'Dormeuil', imageUrl: `${BASE_URL}ESDM-796002D.jpg`, pattern: 'Flannel', color: 'Grey' },
    { id: 'ESDM-796003D', name: 'Anthracite Flannel', mill: 'Dormeuil', imageUrl: `${BASE_URL}ESDM-796003D.jpg`, pattern: 'Flannel', color: 'Charcoal' },
    { id: 'ESDM-994120D', name: 'Royal Blue Solid', mill: 'Dormeuil', imageUrl: `${BASE_URL}ESDM-994120D.jpg`, pattern: 'Solid', color: 'Royal Blue' },
];

// ============================================================================
// LORO PIANA (3 swatches)
// Italian luxury mill - ultimate cashmere and fine wools
// ============================================================================
const LORO_PIANA: FabricSwatch[] = [
    { id: 'ESLP-N734011L', name: 'Navy Blue Super 170s', mill: 'Loro Piana', imageUrl: `${BASE_URL}ESLP-N734011L.jpg`, pattern: 'Solid', color: 'Navy' },
    { id: 'ESLP-N775024L', name: 'Charcoal Super 170s', mill: 'Loro Piana', imageUrl: `${BASE_URL}ESLP-N775024L.jpg`, pattern: 'Solid', color: 'Charcoal' },
    { id: 'ESLP-N775041L', name: 'Medium Grey Super 170s', mill: 'Loro Piana', imageUrl: `${BASE_URL}ESLP-N775041L.jpg`, pattern: 'Solid', color: 'Grey' },
];

// ============================================================================
// OTHER MILLS (46 swatches)
// Various premium mills and exclusive fabrics
// ============================================================================
const OTHER_MILLS: FabricSwatch[] = [
    // ESAT - Premium Imports
    { id: 'ESAT-2255', name: 'Classic Navy Worsted', mill: 'Other', imageUrl: `${BASE_URL}ESAT-2255.jpg`, pattern: 'Solid', color: 'Navy' },
    // ESLM
    { id: 'ESLM-853L', name: 'Medium Grey Plain', mill: 'Other', imageUrl: `${BASE_URL}ESLM-853L.jpg`, pattern: 'Solid', color: 'Grey' },
    // ESLW - Lightweight
    { id: 'ESLW-3502', name: 'Summer Navy', mill: 'Other', imageUrl: `${BASE_URL}ESLW-3502.jpg`, pattern: 'Solid', color: 'Navy' },
    { id: 'ESLW-6020', name: 'Light Grey Summer', mill: 'Other', imageUrl: `${BASE_URL}ESLW-6020.jpg`, pattern: 'Solid', color: 'Light Grey' },
    // ESMB - Mahogany Brown collection
    { id: 'ESMB-21534W', name: 'Dark Brown Solid', mill: 'Other', imageUrl: `${BASE_URL}ESMB-21534W.jpg`, pattern: 'Solid', color: 'Brown' },
    { id: 'ESMB-21567W', name: 'Chocolate Brown Twill', mill: 'Other', imageUrl: `${BASE_URL}ESMB-21567W.jpg`, pattern: 'Twill', color: 'Brown' },
    { id: 'ESMB-21580W', name: 'Espresso Brown Plain', mill: 'Other', imageUrl: `${BASE_URL}ESMB-21580W.jpg`, pattern: 'Solid', color: 'Dark Brown' },
    { id: 'ESMB-21581W', name: 'Cognac Brown Herringbone', mill: 'Other', imageUrl: `${BASE_URL}ESMB-21581W.jpg`, pattern: 'Herringbone', color: 'Brown' },
    { id: 'ESMB-21582W', name: 'Russet Brown Solid', mill: 'Other', imageUrl: `${BASE_URL}ESMB-21582W.jpg`, pattern: 'Solid', color: 'Brown' },
    { id: 'ESMB-21583W', name: 'Walnut Brown Plain', mill: 'Other', imageUrl: `${BASE_URL}ESMB-21583W.jpg`, pattern: 'Solid', color: 'Brown' },
    { id: 'ESMB-34641W', name: 'Caramel Brown Tweed', mill: 'Other', imageUrl: `${BASE_URL}ESMB-34641W.jpg`, pattern: 'Tweed', color: 'Brown' },
    // ESSD - Seasonal/Special
    { id: 'ESSD-17025E', name: 'Olive Green Solid', mill: 'Other', imageUrl: `${BASE_URL}ESSD-17025E.jpg`, pattern: 'Solid', color: 'Green' },
    { id: 'ESSD-17026E', name: 'Forest Green Plain', mill: 'Other', imageUrl: `${BASE_URL}ESSD-17026E.jpg`, pattern: 'Solid', color: 'Green' },
    { id: 'ESSD-18015S', name: 'Burgundy Solid', mill: 'Other', imageUrl: `${BASE_URL}ESSD-18015S.jpg`, pattern: 'Solid', color: 'Burgundy' },
    { id: 'ESSD-18018S', name: 'Wine Red Plain', mill: 'Other', imageUrl: `${BASE_URL}ESSD-18018S.jpg`, pattern: 'Solid', color: 'Burgundy' },
    { id: 'ESSD-18022S', name: 'Deep Burgundy Twill', mill: 'Other', imageUrl: `${BASE_URL}ESSD-18022S.jpg`, pattern: 'Twill', color: 'Burgundy' },
    { id: 'ESSD-21013S', name: 'Tan Solid', mill: 'Other', imageUrl: `${BASE_URL}ESSD-21013S.jpg`, pattern: 'Solid', color: 'Tan' },
    { id: 'ESSD-21018S', name: 'Camel Plain', mill: 'Other', imageUrl: `${BASE_URL}ESSD-21018S.jpg`, pattern: 'Solid', color: 'Tan' },
    { id: 'ESSD-21024S', name: 'Sand Beige Solid', mill: 'Other', imageUrl: `${BASE_URL}ESSD-21024S.jpg`, pattern: 'Solid', color: 'Beige' },
    { id: 'ESSD-21027S', name: 'Cream Linen Blend', mill: 'Other', imageUrl: `${BASE_URL}ESSD-21027S.jpg`, pattern: 'Solid', color: 'Cream' },
    { id: 'ESSD-28015S', name: 'Light Blue Solid', mill: 'Other', imageUrl: `${BASE_URL}ESSD-28015S.jpg`, pattern: 'Solid', color: 'Light Blue' },
    { id: 'ESSD-28016S', name: 'Sky Blue Plain', mill: 'Other', imageUrl: `${BASE_URL}ESSD-28016S.jpg`, pattern: 'Solid', color: 'Light Blue' },
    { id: 'ESSD-28017S', name: 'Powder Blue Solid', mill: 'Other', imageUrl: `${BASE_URL}ESSD-28017S.jpg`, pattern: 'Solid', color: 'Light Blue' },
    { id: 'ESSD-28020S', name: 'Ice Blue Twill', mill: 'Other', imageUrl: `${BASE_URL}ESSD-28020S.jpg`, pattern: 'Twill', color: 'Light Blue' },
    { id: 'ESSD-28040S', name: 'Cornflower Blue Plain', mill: 'Other', imageUrl: `${BASE_URL}ESSD-28040S.jpg`, pattern: 'Solid', color: 'Blue' },
    // ESTD - Textured
    { id: 'ESTD-F7291T', name: 'Textured Grey Tweed', mill: 'Other', imageUrl: `${BASE_URL}ESTD-F7291T.jpg`, pattern: 'Tweed', color: 'Grey' },
    { id: 'ESTD-F7413M', name: 'Textured Brown Tweed', mill: 'Other', imageUrl: `${BASE_URL}ESTD-F7413M.jpg`, pattern: 'Tweed', color: 'Brown' },
    // ESTR - Traditional
    { id: 'ESTR-TRA004F', name: 'Traditional Navy Check', mill: 'Other', imageUrl: `${BASE_URL}ESTR-TRA004F.jpg`, pattern: 'Check', color: 'Navy' },
    // HSWC - Heritage Collection
    { id: 'HSWC-11556', name: 'Heritage Grey Flannel', mill: 'Other', imageUrl: `${BASE_URL}HSWC-11556.jpg`, pattern: 'Flannel', color: 'Grey' },
    { id: 'HSWC-61275', name: 'Heritage Navy Solid', mill: 'Other', imageUrl: `${BASE_URL}HSWC-61275.jpg`, pattern: 'Solid', color: 'Navy' },
    { id: 'HSWC-61298', name: 'Heritage Charcoal Plain', mill: 'Other', imageUrl: `${BASE_URL}HSWC-61298.jpg`, pattern: 'Solid', color: 'Charcoal' },
    { id: 'HSWC-62349', name: 'Heritage Grey Herringbone', mill: 'Other', imageUrl: `${BASE_URL}HSWC-62349.jpg`, pattern: 'Herringbone', color: 'Grey' },
    // SBAC - Specialty
    { id: 'SBAC-KUSHKA', name: 'Kushka Wool Blend', mill: 'Other', imageUrl: `${BASE_URL}SBAC-KUSHKA.jpg`, pattern: 'Solid', color: 'Grey' },
    { id: 'SBAC-MARIKA', name: 'Marika Silk Blend', mill: 'Other', imageUrl: `${BASE_URL}SBAC-MARIKA.jpg`, pattern: 'Solid', color: 'Navy' },
    { id: 'SBAC-NIKEL', name: 'Nikel Premium Wool', mill: 'Other', imageUrl: `${BASE_URL}SBAC-NIKEL.jpg`, pattern: 'Solid', color: 'Grey' },
    // SBMC - Special Collection
    { id: 'SBMC-BK301_BE439', name: 'Black Formal', mill: 'Other', imageUrl: `${BASE_URL}SBMC-BK301_BE439.jpg`, pattern: 'Solid', color: 'Black' },
    { id: 'SBMC-CW001', name: 'Classic White Poplin', mill: 'Other', imageUrl: `${BASE_URL}SBMC-CW001.jpg`, pattern: 'Solid', color: 'White' },
    { id: 'SBMC-NY322_BE439', name: 'Navy Executive', mill: 'Other', imageUrl: `${BASE_URL}SBMC-NY322_BE439.jpg`, pattern: 'Solid', color: 'Navy' },
    // SCYC
    { id: 'SCYC-CYC', name: 'Cyclone Grey Blend', mill: 'Other', imageUrl: `${BASE_URL}SCYC-CYC.jpg`, pattern: 'Solid', color: 'Grey' },
    // SHFW - Shirting Fabrics
    { id: 'SHFW-0222H', name: 'White Royal Oxford', mill: 'Other', imageUrl: `${BASE_URL}SHFW-0222H.jpg`, pattern: 'Oxford', color: 'White' },
    { id: 'SHFW-2003J', name: 'Blue French Cuff', mill: 'Other', imageUrl: `${BASE_URL}SHFW-2003J.jpg`, pattern: 'Solid', color: 'Blue' },
    { id: 'SHFW-2016J', name: 'Light Blue Twill', mill: 'Other', imageUrl: `${BASE_URL}SHFW-2016J.jpg`, pattern: 'Twill', color: 'Light Blue' },
    { id: 'SHFW-2021J', name: 'Sky Blue Poplin', mill: 'Other', imageUrl: `${BASE_URL}SHFW-2021J.jpg`, pattern: 'Solid', color: 'Light Blue' },
    { id: 'SHFW-904889H', name: 'White Herringbone', mill: 'Other', imageUrl: `${BASE_URL}SHFW-904889H.jpg`, pattern: 'Herringbone', color: 'White' },
    // SMAB - MAB Exclusive
    { id: 'SMAB-T', name: 'MAB Exclusive Twill', mill: 'Other', imageUrl: `${BASE_URL}SMAB-T.jpg`, pattern: 'Twill', color: 'Navy' },
    // STAC
    { id: 'STAC-O', name: 'Staccato Grey', mill: 'Other', imageUrl: `${BASE_URL}STAC-O.jpg`, pattern: 'Solid', color: 'Grey' },
];

// ============================================================================
// COMBINED EXPORT
// ============================================================================
export const FABRIC_SWATCHES: FabricSwatch[] = [
    ...HOLLAND_SHERRY,
    ...SCABAL,
    ...DORMEUIL,
    ...LORO_PIANA,
    ...OTHER_MILLS,
];

// Utility function to get fabrics by mill
export const getFabricsByMill = (mill: FabricMill): FabricSwatch[] => {
    return FABRIC_SWATCHES.filter(f => f.mill === mill);
};

// Get all unique mills
export const getAllMills = (): FabricMill[] => {
    return ['Holland & Sherry', 'Scabal', 'Dormeuil', 'Loro Piana', 'Other'];
};

// Get all unique patterns
export const getAllPatterns = (): string[] => {
    return [...new Set(FABRIC_SWATCHES.map(f => f.pattern))];
};

// Get all unique colors
export const getAllColors = (): string[] => {
    return [...new Set(FABRIC_SWATCHES.map(f => f.color))];
};
