
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface WardrobeItem {
  id: string;
  name: string;
  url: string;
  type: 'product' | 'fabric';
  category: 'Shirt' | 'Suit' | 'Fabric';
  mill?: string;
}

export interface OutfitLayer {
  garment: WardrobeItem | null; // null represents the base model layer
  target?: 'shirt' | 'suit';
  poseImages: Record<string, string>; // Maps pose instruction to image URL
}
