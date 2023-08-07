package com.resteam.smartway.service.dto;

import com.resteam.smartway.domain.Restaurant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BankAccountInfoDTO {

    private UUID id;

    private String accountNumber;

    private String bankName;

    private boolean isChoose;

    private String logoBank;

    private String bin;

    private String fullNameBankAccount;

    private boolean isDefault;

    private boolean isActive;

    private Restaurant restaurant;
}
