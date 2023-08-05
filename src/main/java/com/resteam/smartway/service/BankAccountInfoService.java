package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.BankAccountInfoDTO;
import java.util.List;

public interface BankAccountInfoService {
    List<BankAccountInfoDTO> bankAccountInfoList();
    BankAccountInfoDTO createBankAccountInfo(BankAccountInfoDTO bankAccountInfoDTO);
    BankAccountInfoDTO updateBankAccountInfo(BankAccountInfoDTO bankAccountInfoDTO);

    void changeDefaultBankAccountInfo(String id);

    void changeNotActiveBankAccountInfo(String id);
}
