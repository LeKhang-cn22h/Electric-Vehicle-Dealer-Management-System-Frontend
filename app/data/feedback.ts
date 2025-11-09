export interface Feedback {
    id: number;
    userId: number;
    title: string;
    message: string;
    createdAt: Date;
    status:boolean;
    reply?: string;
}
export const feedbackList: Feedback[] = [
    {
        id: 1,
        userId: 101,  
        title: "Excellent Service",
        message: "Great service! ná  d f f d d f fd fd fd d fd f",
        createdAt: new Date('2024-01-15T10:30:00'),
        status:true,
        reply: "Thank you for your feedback!"
    },
    {
        id: 2,
        userId: 102,
        title: "Product Quality",
        message: "Could improve the delivery time.",
        createdAt: new Date('2024-02-20T14:45:00'),
        status:false
    },
    {
        id: 3,
        userId: 103,
        title: "Delivery Experience",
        message: "Could improve the delivery time.",
        createdAt: new Date('2024-02-20T14:45:00'),
        status:false
    },
    {
        id: 3,
        userId: 103,
        title: "Delivery Experience",
        message: "Could improve the delivery time.",
        createdAt: new Date('2024-02-20T14:45:00'),
        status:false
    },
    {
        id: 4,
        userId: 104,
        title: "Customer Support",
        message: "Could improve the delivery time.",
        createdAt: new Date('2024-02-20T14:45:00'),
        status:false
    },
    {
        id: 5,
        userId: 105,
        title: "Website Usability",
        message: "Could improve the delivery time.",
        createdAt: new Date('2024-02-20T14:45:00'),
        status:false
    },

    {
        id: 6,
        userId: 106,
        title: "App Performance",
        message: "Could improve the delivery time.",
        createdAt: new Date('2024-02-20T14:45:00'),
        status:false
    },
    {
        id: 7,
        userId: 107,
        title: "Pricing Feedback",
        message: "Could improve the delivery time.",
        createdAt: new Date('2024-02-20T14:45:00'),
        status:false
    },
    {
        id: 8,
        userId: 108,
        title: "Feature Request",
        message: "Could improve the delivery time.",
        createdAt: new Date('2024-02-20T14:45:00'),
        status:false
    },
    {
        id: 9,
        userId: 109,
        title: "Overall Satisfaction",
        message: "Could improve the delivery time.",
        createdAt: new Date('2024-02-20T14:45:00'),
        status:false
    },
    {
        id: 10,
        userId: 110,
        title: "Return Policy",
        message: "Could improve the delivery time.",
        createdAt: new Date('2024-02-20T14:45:00'),
        status:false
    },
    {
        id: 11,
        userId: 111,
        title: "Shipping Options",
        message: "Could improve the delivery time.",
        createdAt: new Date('2024-02-20T14:45:00'),
        status:false
    },
    {
        id: 12,
        userId: 112,
        title: "Payment Methods",
        message: "Could improve the delivery time.",
        createdAt: new Date('2024-02-20T14:45:00'),
        status:false
    },
    {
        id: 13,
        userId: 113,
        title: "Product Availability",
        message: "Could improve the delivery time.",
        createdAt: new Date('2024-02-20T14:45:00'),
        status:false
    },


]