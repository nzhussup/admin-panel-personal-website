package com.nzhussup.backendadminpanel.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "education")
public class Education implements Identifiable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String institution;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private Date startDate;

    @Column
    private Date endDate;

    @Column(nullable = false)
    private String degree;

    @Column
    private String thesis;

    @Column
    private String description;

    @Column(nullable = false)
    private int displayOrder;

    @Override
    public Long getId() {
        return id;
    }

}