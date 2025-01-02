package com.nzhussup.backendadminpanel.controller;

import com.nzhussup.backendadminpanel.config.AppConfig;
import com.nzhussup.backendadminpanel.model.Education;
import com.nzhussup.backendadminpanel.service.EducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConfig.baseApiPath+"education")
public class EducationController extends BaseController<Education>{

    @Autowired
    public EducationController(EducationService educationService) {
        super(educationService);
    }
}
