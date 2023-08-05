package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.BankAccountInfoService;
import com.resteam.smartway.service.dto.BankAccountInfoDTO;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

@RestController
@RequestMapping("/api/bankAccountInfo")
@RequiredArgsConstructor
public class BankAccountInfoResource {

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private static final String ENTITY_NAME = "bankAccount";
    private static final String SET_DEFAULT = "bank.setDefault";
    private static final String SET_ACTIVE = "bank.setActive";

    private final BankAccountInfoService bankAccountInfoService;

    @GetMapping
    public ResponseEntity<List<BankAccountInfoDTO>> getAllBankAccountInfo() {
        List<BankAccountInfoDTO> bankAccountInfoList = bankAccountInfoService.bankAccountInfoList();
        return new ResponseEntity<>(bankAccountInfoList, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<BankAccountInfoDTO> createBankAccount(@RequestBody BankAccountInfoDTO bankAccountInfoDTO) {
        BankAccountInfoDTO result = bankAccountInfoService.createBankAccountInfo(bankAccountInfoDTO);
        return ResponseEntity
            .created(URI.create(result.getId().toString()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(bankAccountInfoDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BankAccountInfoDTO> updateBankAccountInfo(
        @PathVariable(value = "id") final String id,
        @RequestBody BankAccountInfoDTO bankAccountInfoDTO
    ) {
        if (bankAccountInfoDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "id null");
        }
        if (!Objects.equals(id, bankAccountInfoDTO.getId())) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "id invalid");
        }

        BankAccountInfoDTO result = bankAccountInfoService.updateBankAccountInfo(bankAccountInfoDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PutMapping("/setDefault/{id}")
    public ResponseEntity<String> setDefaultBankAccountInfo(@PathVariable(value = "id") final String id) {
        bankAccountInfoService.changeDefaultBankAccountInfo(id);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert(applicationName, SET_DEFAULT, id)).body(id);
    }

    @PutMapping("/setActive/{id}")
    public ResponseEntity<String> setActiveBankAccountInfo(@PathVariable(value = "id") final String id) {
        bankAccountInfoService.changeNotActiveBankAccountInfo(id);
        return ResponseEntity.ok().headers(HeaderUtil.createAlert(applicationName, SET_ACTIVE, id)).body(id);
    }
}
