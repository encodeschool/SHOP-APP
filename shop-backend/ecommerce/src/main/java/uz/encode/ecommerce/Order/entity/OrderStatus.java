package uz.encode.ecommerce.Order.entity;

public enum OrderStatus {
    PENDING_PAYMENT,   // ← NEW: order created, awaiting payment confirmation
    PENDING,           // payment confirmed, awaiting processing
    PAID,              // explicitly marked paid
    SHIPPED,
    DELIVERED,
    CANCELLED,
    PAYMENT_FAILED     // ← NEW: CLICK returned an error
}
