package uz.encode.ecommerce.WebComponents.Widgets.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import uz.encode.ecommerce.Category.entity.Category;
import uz.encode.ecommerce.Category.repository.CategoryRepository;
import uz.encode.ecommerce.Category.service.CategoryService;
import uz.encode.ecommerce.WebComponents.Widgets.dto.HomeWidgetDTO;
import uz.encode.ecommerce.WebComponents.Widgets.entity.HomeWidget;
import uz.encode.ecommerce.WebComponents.Widgets.repository.HomeWidgetRepository;

@RestController
@RequestMapping("/api/home-widgets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HomeWidgetController {

    private final HomeWidgetRepository widgetRepo;
    private final CategoryService categoryService;

    @GetMapping
    public List<HomeWidget> getAllActive() {
        return widgetRepo.findAllByActiveTrueOrderByOrderIndexAsc();
    }

    @PostMapping
    public HomeWidget create(@RequestBody HomeWidgetDTO dto) {
        HomeWidget widget = new HomeWidget();
        mapDtoToEntity(dto, widget);
        return widgetRepo.save(widget);
    }

    @PutMapping("/{id}")
    public HomeWidget update(@PathVariable Long id, @RequestBody HomeWidgetDTO dto) {
        HomeWidget widget = widgetRepo.findById(id).orElse(new HomeWidget());
        mapDtoToEntity(dto, widget);
        widget.setId(id);
        return widgetRepo.save(widget);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        widgetRepo.deleteById(id);
    }

    // helper
    private void mapDtoToEntity(HomeWidgetDTO dto, HomeWidget widget) {
        widget.setTitle(dto.getTitle());
        widget.setWidgetType(dto.getWidgetType());
        widget.setOrderIndex(dto.getOrderIndex());
        widget.setBackgroundColor(dto.getBackgroundColor());
        widget.setIconName(dto.getIconName());
        widget.setActive(dto.isActive());
        widget.setConfigJson(dto.getConfigJson());

        if (dto.getCategoryId() != null) {
            Category category = categoryService.findById(dto.getCategoryId());
            widget.setCategory(category);
        } else {
            widget.setCategory(null);
        }
    }
}