package com.nzhussup.backendadminpanel.repository;

import com.nzhussup.backendadminpanel.model.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Long> {
}
