package uz.encode.ecommerce.Analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

public class MonthlyCountDTO {

    private String month;
    private long count;

    public MonthlyCountDTO() {
    }

    public MonthlyCountDTO(String month, long count) {
        this.month = month;
        this.count = count;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

}
