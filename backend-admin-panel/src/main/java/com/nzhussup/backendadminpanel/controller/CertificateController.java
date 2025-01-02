package com.nzhussup.backendadminpanel.controller;

import com.nzhussup.backendadminpanel.config.AppConfig;
import com.nzhussup.backendadminpanel.model.Certificate;
import com.nzhussup.backendadminpanel.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(AppConfig.baseApiPath+"certificate")
public class CertificateController extends BaseController<Certificate> {

    @Autowired
    public CertificateController(CertificateService certificateService) {
        super(certificateService);
    }
}
