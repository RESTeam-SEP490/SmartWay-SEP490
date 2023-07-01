package com.resteam.smartway.web.rest.errors.handling;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.web.util.HeaderUtil;

@Slf4j
@ControllerAdvice
@RestController
public class ConstraintViolationExceptionHandler {

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    @ExceptionHandler(value = DataIntegrityViolationException.class)
    protected ResponseEntity<Void> handleConstraintViolation(DataIntegrityViolationException ex) {
        if (ExceptionUtils.indexOfType(ex, ConstraintViolationException.class) != -1) return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createFailureAlert(applicationName, true, "", "constraintViolation", "Constraint violation error"))
            .build(); else return null;
    }
}
