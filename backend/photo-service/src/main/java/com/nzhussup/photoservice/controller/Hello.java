package com.nzhussup.photoservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/photo")
public class Hello {

    @GetMapping
    public String hello() {
        return "Hello World";
    }
}
