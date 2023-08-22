package com.resteam.smartway.domain;

import com.resteam.smartway.domain.enumeration.CurrencyUnit;
import java.io.Serializable;
import java.time.Instant;
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
@Table(name = "restaurant")
public class Restaurant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id", length = 30, nullable = false)
    private String id;

    @Column(name = "name")
    private String name;

    @Column(name = "phone")
    private String phone;

    @Column(name = "plan_expiry")
    private Instant planExpiry;

    @Column(name = "stripe_customer_id")
    private String stripeCustomerId;

    @Column(name = "stripe_subscription_id")
    private String stripeSubscriptionId;

    @Column(name = "is_new", columnDefinition = "BIT(1) default false")
    private Boolean isNew = true;

    @Column(name = "currency_unit")
    @Enumerated(EnumType.STRING)
    private CurrencyUnit currencyUnit;

    @Column(name = "lang_key", length = 10)
    private String langKey;

    @Column(name = "address")
    private String address;

    @OneToOne
    @JoinColumn(name = "owner")
    private User owner;

    public Restaurant(String id) {
        this.id = id;
    }
}
