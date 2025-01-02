package com.nzhussup.backendadminpanel.service;

import com.nzhussup.backendadminpanel.model.Skill;
import com.nzhussup.backendadminpanel.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SkillService extends BaseService<Skill> {

    @Autowired
    public SkillService(SkillRepository skillRepository) {
        super(skillRepository);
    }
}

