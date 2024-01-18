package com.jan.diagramcanvas.controller;

import com.jan.diagramcanvas.models.SvgInfo;
import com.jan.diagramcanvas.service.SaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SaveController {
    private final SaveService saveService;

    @PostMapping("api/save/{owner}")
    public Long save(@RequestBody List<SvgInfo> list, @PathVariable String owner) throws Exception {
        Long inserted = 0L;

        inserted += saveService.saveTest(owner, list);

        System.out.println(owner + inserted);

        return inserted;
    }

    @GetMapping("api/read/{owner}")
    public ResponseEntity<?> read(@PathVariable String owner) {
        return ResponseEntity.ok(saveService.readTest(owner));
    }
}
