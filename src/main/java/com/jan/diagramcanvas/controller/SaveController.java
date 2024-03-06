package com.jan.diagramcanvas.controller;

import com.jan.diagramcanvas.models.SvgInfo;
import com.jan.diagramcanvas.service.SaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SaveController {
    private final SaveService saveService;

    @PostMapping("api/save/{owner}/{window}")
    public Long save(@RequestBody List<SvgInfo> list, @PathVariable String owner, @PathVariable String window) throws Exception {
        return saveService.saveTest(owner, window, list);
    }

    @DeleteMapping("api/save/{owner}/{window}")
    public Long delete(@PathVariable String owner, @PathVariable String window, @RequestParam String ids) throws Exception {
        return saveService.deleteFields(owner, window, ids);
    }

    @GetMapping("api/read/{owner}")
    public ResponseEntity<?> read(@PathVariable String owner) {
        return ResponseEntity.ok().body(saveService.readTest(owner));
    }
}
