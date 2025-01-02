package com.nzhussup.backendadminpanel.controller;

import com.nzhussup.backendadminpanel.config.AppConfig;
import com.nzhussup.backendadminpanel.model.Skill;
import com.nzhussup.backendadminpanel.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(AppConfig.baseApiPath+"skill")
public class SkillController extends BaseController<Skill> {

    @Autowired
    public SkillController(SkillService skillService) {
        super(skillService);
    }
}
