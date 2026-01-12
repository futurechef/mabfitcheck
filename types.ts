
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface WardrobeItem {
  id: string;
  name: string;
  url: string;
  type: 'product' | 'fabric';
  category: 'Shirt' | 'Suit' | 'Fabric' | 'Jacket' | 'Trousers';
  mill?: string;
}

export type ClothingTarget = 'shirt' | 'jacket' | 'trousers' | 'suit';

export interface OutfitLayer {
  garment: WardrobeItem | null; // null represents the base model layer or an action like jacket removal
  target?: ClothingTarget;
  action?: 'remove_jacket';
  poseImages: Record<string, string>; // Maps pose instruction to image URL
}
