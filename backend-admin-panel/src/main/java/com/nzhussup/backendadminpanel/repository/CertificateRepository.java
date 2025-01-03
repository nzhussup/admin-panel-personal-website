package com.nzhussup.backendadminpanel.repository;

import com.nzhussup.backendadminpanel.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
}
