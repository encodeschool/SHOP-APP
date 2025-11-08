package uz.encode.ecommerce.Analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class MonthlyCountDTO {

    private String monthName;
    private Long count;

    // THIS CONSTRUCTOR MUST EXIST AND BE PUBLIC
    public MonthlyCountDTO(String monthName, Long count) {
        this.monthName = monthName;
        this.count = count;
    }

    // Default constructor (optional but safe)
    public MonthlyCountDTO() {}

    // Getters (required for Hibernate result mapping)
    public String getMonthName() {
        return monthName;
    }

    public Long getCount() {
        return count;
    }

    // Setters (optional, but good practice)
    public void setMonthName(String monthName) {
        this.monthName = monthName;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}