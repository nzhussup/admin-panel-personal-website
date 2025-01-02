package com.nzhussup.backendadminpanel.service;

import com.nzhussup.backendadminpanel.model.Project;
import com.nzhussup.backendadminpanel.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class ProjectService extends BaseService<Project> {

    @Autowired
    public ProjectService(ProjectRepository projectRepository) {
        super(projectRepository);
    }

}
