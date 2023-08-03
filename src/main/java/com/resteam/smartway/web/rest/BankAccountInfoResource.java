package com.resteam.smartway.web.rest;

import com.resteam.smartway.domain.BankAccountInfo;
import com.resteam.smartway.service.BankAccountInfoService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bankAccountInfo")
@RequiredArgsConstructor
public class BankAccountInfoResource {

    private final BankAccountInfoService bankAccountInfoService;

    @GetMapping
    public ResponseEntity<List<BankAccountInfo>> getAllBankAccountInfo() {
        List<BankAccountInfo> bankAccountInfoList = bankAccountInfoService.bankAccountInfoList();
        return new ResponseEntity<>(bankAccountInfoList, HttpStatus.OK);
    }
}
