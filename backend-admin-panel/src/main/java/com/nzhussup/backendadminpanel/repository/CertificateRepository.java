package com.nzhussup.backendadminpanel.repository;

import com.nzhussup.backendadminpanel.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
}
