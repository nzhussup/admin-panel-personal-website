package com.nzhussup.backendadminpanel.service;

import com.nzhussup.backendadminpanel.model.Education;
import com.nzhussup.backendadminpanel.repository.EducationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EducationService extends BaseService<Education> {


    @Autowired
    public EducationService(EducationRepository educationRepository) {
        super(educationRepository);
    }
}

