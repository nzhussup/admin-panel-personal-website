package com.nzhussup.backendadminpanel.repository;

import com.nzhussup.backendadminpanel.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
