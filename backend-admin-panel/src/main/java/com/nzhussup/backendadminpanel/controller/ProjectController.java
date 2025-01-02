package com.nzhussup.backendadminpanel.controller;

import com.nzhussup.backendadminpanel.config.AppConfig;
import com.nzhussup.backendadminpanel.model.Project;
import com.nzhussup.backendadminpanel.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(AppConfig.baseApiPath+"project")
public class ProjectController extends BaseController<Project> {

    @Autowired
    public ProjectController(ProjectService projectService) {
        super(projectService);
    }
}
