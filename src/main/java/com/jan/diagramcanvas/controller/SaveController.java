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
        Long inserted = 0L;

        inserted += saveService.saveTest(owner, window, list);

        System.out.println(owner + " inserted : " + inserted);

        return inserted;
    }

    @DeleteMapping("api/save/{owner}/{window}")
    public Long delete(@PathVariable String owner, @PathVariable String window, @RequestParam String ids) throws Exception {
        Long deleted = 0L;

        System.out.println(owner + " " + window);
        System.out.println(ids);

        deleted = saveService.deleteFields(owner, window, ids);

        return deleted;
    }

    @GetMapping("api/read/{owner}")
    public ResponseEntity<?> read(@PathVariable String owner) {
        return ResponseEntity.ok().body(saveService.readTest(owner));
    }
}
