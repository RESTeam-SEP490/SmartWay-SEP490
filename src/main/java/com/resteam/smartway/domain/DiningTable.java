package com.resteam.smartway.domain;

import java.io.Serializable;
import java.util.UUID;
import javax.persistence.*;
import javax.persistence.Table;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "dining_table")
public class DiningTable implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column
    private String name;
}
