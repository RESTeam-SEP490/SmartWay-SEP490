package com.resteam.smartway.service;

import com.resteam.smartway.domain.BankAccountInfo;
import com.resteam.smartway.repository.BankAccountInfoRepository;
import com.resteam.smartway.repository.UserRepository;
import com.resteam.smartway.service.dto.BankAccountInfoDTO;
import com.resteam.smartway.service.mapper.BankAccountInfoMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class BankAccountInfoServiceImpl implements BankAccountInfoService {

    private final String ENTITY_NAME = "bank_account_info";
    private final BankAccountInfoRepository bankAccountInfoRepository;
    private final UserRepository userRepository;
    private final BankAccountInfoMapper bankAccountInfoMapper;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Override
    public List<BankAccountInfoDTO> bankAccountInfoList() {
        List<BankAccountInfo> bankAccountInfoList = bankAccountInfoRepository.findAll();
        return bankAccountInfoMapper.toDto(bankAccountInfoList);
    }

    @Override
    public BankAccountInfoDTO createBankAccountInfo(BankAccountInfoDTO bankAccountInfoDTO) {
        bankAccountInfoRepository
            .findBankAccountInfoByAccountNumberAndBin(bankAccountInfoDTO.getAccountNumber(), bankAccountInfoDTO.getBin())
            .ifPresent(m -> {
                throw new BadRequestAlertException(applicationName, ENTITY_NAME, "existed");
            });
        List<BankAccountInfo> bankAccountInfoList = bankAccountInfoRepository.findAll();
        if (bankAccountInfoList.isEmpty()) {
            bankAccountInfoDTO.setDefault(true);
        }
        bankAccountInfoDTO.setActive(true);
        BankAccountInfo bankAccountInfo = bankAccountInfoMapper.toEntity(bankAccountInfoDTO);
        return bankAccountInfoMapper.toDto(bankAccountInfoRepository.save(bankAccountInfo));
    }

    @Override
    public BankAccountInfoDTO updateBankAccountInfo(BankAccountInfoDTO bankAccountInfoDTO) {
        BankAccountInfo bankAccountInfo = bankAccountInfoRepository
            .findById(bankAccountInfoDTO.getId())
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "existed"));
        bankAccountInfoRepository
            .findBankAccountInfoByAccountNumberAndBin(bankAccountInfoDTO.getAccountNumber(), bankAccountInfoDTO.getBin())
            .ifPresent(m -> {
                throw new BadRequestAlertException(applicationName, ENTITY_NAME, "existed");
            });
        bankAccountInfoMapper.partialUpdate(bankAccountInfo, bankAccountInfoDTO);
        bankAccountInfoRepository.save(bankAccountInfo);
        return bankAccountInfoMapper.toDto(bankAccountInfo);
    }

    @Override
    public void changeDefaultBankAccountInfo(String id) {
        BankAccountInfo bankAccountInfo = bankAccountInfoRepository
            .findById(UUID.fromString(id))
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "existed"));
        List<BankAccountInfo> bankAccountInfoList = bankAccountInfoRepository.findAll();
        for (BankAccountInfo b : bankAccountInfoList) {
            b.setDefault(false);
            bankAccountInfoRepository.save(b);
        }
        bankAccountInfo.setDefault(true);
        bankAccountInfoMapper.toDto(bankAccountInfo);
    }

    @Override
    public void changeNotActiveBankAccountInfo(String id) {
        BankAccountInfo bankAccountInfo = bankAccountInfoRepository
            .findById(UUID.fromString(id))
            .orElseThrow(() -> new BadRequestAlertException("Entity not found", ENTITY_NAME, "existed"));
        bankAccountInfo.setActive(false);
        bankAccountInfoMapper.toDto(bankAccountInfo);
    }
}
