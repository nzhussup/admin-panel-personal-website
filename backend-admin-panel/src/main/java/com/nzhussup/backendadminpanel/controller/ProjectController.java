package com.nzhussup.backendadminpanel.controller;

import com.nzhussup.backendadminpanel.model.Project;
import com.nzhussup.backendadminpanel.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/project")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    ResponseEntity<?> findAll() {
        try {
            List<Project> projects = projectService.findAll();
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    ResponseEntity<?> save(@RequestBody Project project) {
        try {
            Project savedProject = projectService.save(project);
            return ResponseEntity.ok(savedProject);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping
    ResponseEntity<?> update(@RequestBody Project project) {
        try {
            Project updatedProject = projectService.update(project);
            return ResponseEntity.ok(updatedProject);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping
    ResponseEntity<?> delete(@RequestBody Project project) {
        try {
            projectService.delete(project.getId());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
