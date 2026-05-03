package uz.encode.ecommerce.Inventory.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import uz.encode.ecommerce.Order.entity.Order;
import uz.encode.ecommerce.Product.entity.Product;

@Entity
@Table(name = "inventory_transactions")
@Getter
@Setter
public class InventoryTransaction {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    private Warehouse warehouse;

    @Enumerated(EnumType.STRING)
    private InventoryType type;

    private Integer quantity;

    private String reason;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    private Order order;
}