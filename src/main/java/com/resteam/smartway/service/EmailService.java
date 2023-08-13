package com.resteam.smartway.service;

public interface EmailService {
    void sendMail(String to, String subject, String body);
}
