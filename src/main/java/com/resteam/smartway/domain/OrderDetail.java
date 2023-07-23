package com.resteam.smartway.domain;

import java.time.Instant;
import java.util.UUID;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "order_detail")
public class OrderDetail {

    @Id
    @GeneratedValue
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private SwOrder swOrder;

    @ManyToOne
    @JoinColumn(name = "menu_item_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private MenuItem menuItem;

    private int quantity;

    @Column(name = "is_cooked", nullable = false)
    private boolean isCooked;

    @Column(name = "is_priority", nullable = false)
    private boolean isPriority;

    @Column(name = "note")
    private String note;

    @Column(name = "notified_time")
    private Instant notifiedTime;

    @CreatedDate
    @Column(name = "created_date", nullable = false)
    private Instant createdDate = Instant.now();
}
