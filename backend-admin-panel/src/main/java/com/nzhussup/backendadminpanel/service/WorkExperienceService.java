package com.nzhussup.backendadminpanel.service;

import com.nzhussup.backendadminpanel.model.WorkExperience;
import com.nzhussup.backendadminpanel.repository.WorkExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WorkExperienceService extends BaseService<WorkExperience> {


    @Autowired
    public WorkExperienceService(WorkExperienceRepository workExperienceRepository) {
        super(workExperienceRepository);
    }
}