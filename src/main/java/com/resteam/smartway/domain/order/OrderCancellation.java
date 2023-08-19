package com.resteam.smartway.domain.order;

import com.resteam.smartway.domain.enumeration.CancellationReason;
import com.resteam.smartway.domain.order.SwOrder;
import java.util.UUID;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "order_cancellation")
public class OrderCancellation {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private SwOrder order;

    @Column(name = "cancellation_reason")
    @Enumerated(EnumType.STRING)
    private CancellationReason cancellationReason;

    @Column(name = "cancellation_note")
    private String cancellationNote;
}
