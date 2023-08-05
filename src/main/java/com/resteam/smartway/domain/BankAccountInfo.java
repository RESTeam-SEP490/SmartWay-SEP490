package com.resteam.smartway.domain;

import com.resteam.smartway.domain.base.AbstractBaseAuditingEntity;
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
@Table(name = "bank_account_info")
public class BankAccountInfo extends AbstractBaseAuditingEntity<UUID> {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "bank_name")
    private String bankName;

    private boolean isDefault;

    private String logoBank;

    private String bin;

    private String fullNameBankAccount;

    private boolean isActive;

    @ManyToOne
    @JoinColumn(name = "restaurant_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private Restaurant restaurant;
}
