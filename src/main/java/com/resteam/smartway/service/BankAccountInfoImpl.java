package com.resteam.smartway.service;

import com.resteam.smartway.domain.BankAccountInfo;
import com.resteam.smartway.repository.BankAccountInfoRepository;
import com.resteam.smartway.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class BankAccountInfoImpl implements BankAccountInfoService {

    private final String ENTITY_NAME = "bank_account_info";
    private final BankAccountInfoRepository bankAccountInfoRepository;
    private final UserRepository userRepository;

    @Override
    public List<BankAccountInfo> bankAccountInfoList() {
        return bankAccountInfoRepository.findAll();
    }

    @Override
    public BankAccountInfo createBankAccountInfo(BankAccountInfo bankAccountInfo) {
        return bankAccountInfoRepository.save(bankAccountInfo);
    }

    @Override
    public BankAccountInfo updateBankAccountInfo(BankAccountInfo bankAccountInfo) {
        return null;
    }
}
