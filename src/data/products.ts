import raw from './products.json';
export interface ProductImage { source: string; local: string; small?: string; alt: string; width: number; height: number }
export interface Product { id: string; slug: string; name: string; paragraphs: string[]; images: ProductImage[]; card: ProductImage; description: string; source: string; related: string[] }
export const products: Product[] = raw;
export const packaging: Record<string, {label: string; sizes: string[]; cartons?: string[]}> = {
 'burgers': {label:'Patty sizes', sizes:['4 oz','5 oz','6 oz','7 oz','8 oz']},
 'grilled-chicken-donair-shawarma': {label:'Package size', sizes:['500 g']},
 'grilled-beef-donair': {label:'Package size', sizes:['500 g']},
 'cooked-sliced-beef-donair-loaf': {label:'Pack size', sizes:['1 kg']},
 'beef-donair-cones': {label:'Individual cone size', sizes:['5 kg','9 kg','12 kg'], cartons:['3 × 5 kg','2 × 9 kg','1 × 12 kg']},
 'chicken-donair-cone-shawarma': {label:'Individual cone size', sizes:['5 kg','8 kg','10 kg'], cartons:['3 × 5 kg','2 × 8 kg','2 × 10 kg']}
};
