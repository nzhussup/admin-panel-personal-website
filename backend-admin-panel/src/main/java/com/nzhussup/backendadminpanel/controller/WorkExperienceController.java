package com.nzhussup.backendadminpanel.controller;

import com.nzhussup.backendadminpanel.config.AppConfig;
import com.nzhussup.backendadminpanel.model.WorkExperience;
import com.nzhussup.backendadminpanel.service.WorkExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConfig.baseApiPath+"work-experience")
public class WorkExperienceController extends BaseController<WorkExperience> {

    @Autowired
    public WorkExperienceController(WorkExperienceService workExperienceService) {
        super(workExperienceService);
    }
}
