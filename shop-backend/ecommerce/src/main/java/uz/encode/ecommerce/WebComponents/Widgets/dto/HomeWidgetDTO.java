package uz.encode.ecommerce.WebComponents.Widgets.dto;

import java.util.UUID;

import lombok.Data;

@Data
public class HomeWidgetDTO {
    private Long id;
    private String title;
    private String widgetType;
    private Integer orderIndex;
    private UUID categoryId;
    private String backgroundColor;
    private String iconName;
    private boolean active = true;
    private String configJson;
}