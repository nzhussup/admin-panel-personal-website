package com.nzhussup.backendadminpanel.repository;

import com.nzhussup.backendadminpanel.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EducationRepository extends JpaRepository<Education, Long> {
}
