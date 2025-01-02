package com.nzhussup.backendadminpanel.controller;

import com.nzhussup.backendadminpanel.model.Identifiable;
import com.nzhussup.backendadminpanel.service.BaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public class BaseController<T extends Identifiable> {

    private final BaseService<T> service;

    public BaseController(BaseService<T> service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<T>> findAll() {
        try {
            List<T> entities = service.findAll();
            return ResponseEntity.ok(entities);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping
    public ResponseEntity<T> save(@RequestBody T entity) {
        try {
            T savedEntity = service.save(entity);
            return ResponseEntity.ok(savedEntity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping
    public ResponseEntity<T> update(@RequestBody T entity) {
        try {
            T updatedEntity = service.update(entity);
            return ResponseEntity.ok(updatedEntity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> delete(@RequestBody T entity) {
        try {
            service.delete(entity.getId());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
