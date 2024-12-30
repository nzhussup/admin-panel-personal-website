package com.nzhussup.backendadminpanel.controller;

import com.nzhussup.backendadminpanel.model.Certificate;
import com.nzhussup.backendadminpanel.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/certificate")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @GetMapping
    ResponseEntity<?> findAll() {
        try {
            List<Certificate> certificates = certificateService.findAll();
            return ResponseEntity.ok(certificates);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    ResponseEntity<?> save(@RequestBody Certificate certificate) {
        try {
            Certificate savedCertificate = certificateService.save(certificate);
            return ResponseEntity.ok(savedCertificate);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping
    ResponseEntity<?> update(@RequestBody Certificate certificate) {
        try {
            Certificate updatedCertificate = certificateService.update(certificate);
            return ResponseEntity.ok(updatedCertificate);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping
    ResponseEntity<?> delete(@RequestBody Certificate certificate) {
        try {
            certificateService.delete(certificate.getId());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
