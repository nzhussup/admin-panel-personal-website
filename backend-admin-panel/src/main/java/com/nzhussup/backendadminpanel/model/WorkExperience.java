package com.nzhussup.backendadminpanel.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "work_experience")
public class WorkExperience implements Identifiable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String location;

    @Column(name = "start_date", nullable = false)
    private String startDate;

    @Column(name = "end_date")
    private String endDate;

    @Column(nullable = false)
    private String position;

    @Column(nullable = false)
    private String description;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Override
    public Long getId() {
        return id;
    }
}
