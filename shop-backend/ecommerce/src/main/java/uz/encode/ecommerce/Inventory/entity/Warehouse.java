package uz.encode.ecommerce.Inventory.entity;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "warehouses")
@Getter
@Setter
public class Warehouse {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private String address;
}
