package com.resteam.smartway.service;

import com.resteam.smartway.domain.BankAccountInfo;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BankAccountInfoService {
    List<BankAccountInfo> bankAccountInfoList();
    BankAccountInfo createBankAccountInfo(BankAccountInfo bankAccountInfo);
    BankAccountInfo updateBankAccountInfo(BankAccountInfo bankAccountInfo);
}
