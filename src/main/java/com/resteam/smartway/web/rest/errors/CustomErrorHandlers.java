package com.resteam.smartway.web.rest.errors;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import tech.jhipster.web.util.HeaderUtil;

@ControllerAdvice
public class CustomErrorHandlers extends ResponseEntityExceptionHandler {

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @ExceptionHandler(value = ConstraintViolationException.class)
    protected ResponseEntity<Void> handleConstraintViolation(ConstraintViolationException ex) {
        return ResponseEntity
            .badRequest()
            .headers(HeaderUtil.createFailureAlert(applicationName, true, "", "constraintViolation", "Constraint violation error"))
            .build();
    }
}
