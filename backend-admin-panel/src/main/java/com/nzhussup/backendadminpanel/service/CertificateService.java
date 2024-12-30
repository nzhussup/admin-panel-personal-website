package com.nzhussup.backendadminpanel.service;

import com.nzhussup.backendadminpanel.model.Certificate;
import com.nzhussup.backendadminpanel.repository.CertificateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;

    public List<Certificate> findAll() {
        return certificateRepository.findAll();
    }

    public Certificate findById(Long id) {
        return certificateRepository.findById(id).orElse(null);
    }

    public Certificate save(Certificate certificate) {
        return certificateRepository.save(certificate);
    }

    public void delete(Long id) {
        certificateRepository.deleteById(id);
    }

    public Certificate update(Certificate certificate) {
        return certificateRepository.save(certificate);
    }
}
