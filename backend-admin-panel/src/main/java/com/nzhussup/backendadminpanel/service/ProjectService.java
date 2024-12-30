package com.nzhussup.backendadminpanel.service;

import com.nzhussup.backendadminpanel.model.Project;
import com.nzhussup.backendadminpanel.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public Project findById(Long id) {
        return projectRepository.findById(id).orElse(null);
    }

    public Project save(Project project) {
        return projectRepository.save(project);
    }

    public void delete(Long id) {
        projectRepository.deleteById(id);
    }

    public Project update(Project project) {
        return projectRepository.save(project);
    }

}
