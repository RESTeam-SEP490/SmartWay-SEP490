package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.OrderService;
import com.resteam.smartway.service.dto.BillDTO;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.PaginationUtil;

@Log4j2
@RestController
@Transactional
@RequiredArgsConstructor
@RequestMapping("/api/bills")
public class BillResource {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<BillDTO>> getAllBills(
        @RequestParam(required = false) Instant startDay,
        @RequestParam(required = false) Instant endDay,
        @RequestParam(required = false) UUID tableId,
        Pageable pageable
    ) {
        if (startDay == null) {
            startDay = Instant.EPOCH;
        }
        if (endDay == null) {
            endDay = Instant.now();
        }
        Page<BillDTO> billsPage = orderService.loadAllBillWithSort(startDay, endDay, tableId, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), billsPage);
        return new ResponseEntity<>(billsPage.getContent(), headers, HttpStatus.OK);
    }
}
