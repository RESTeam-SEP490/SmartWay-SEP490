package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.OrderService;
import com.resteam.smartway.service.dto.BillDTO;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
@Transactional
@RequiredArgsConstructor
@RequestMapping("/api/bills")
public class BillResource {

    private final OrderService orderService;

    @GetMapping("/all-bill")
    public ResponseEntity<Page<BillDTO>> getAllBills(
        @RequestParam Instant startDay,
        @RequestParam Instant endDay,
        @RequestParam(required = false) UUID tableId,
        Pageable pageable
    ) {
        Page<BillDTO> billsPage = orderService.loadAllBillWithSort(startDay, endDay, tableId, pageable);
        return ResponseEntity.ok(billsPage);
    }
}
