package com.nzhussup.backendadminpanel.service;

import com.nzhussup.backendadminpanel.model.Certificate;
import com.nzhussup.backendadminpanel.repository.CertificateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CertificateService extends BaseService<Certificate> {

    @Autowired
    public CertificateService(CertificateRepository certificateRepository) {
        super(certificateRepository);
    }
}
