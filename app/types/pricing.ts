export interface Pricing {
    id: string;
    productId: number;
    basePrice: number;
    discountedPrice: number;
    wholesalePrice: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}
