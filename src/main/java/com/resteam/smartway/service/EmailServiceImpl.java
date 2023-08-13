package com.resteam.smartway.service;

import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class EmailServiceImpl implements EmailService {

    private final String SMTP_HOST = "smtp.gmail.com";
    private final int SMTP_PORT = 587;
    private final String SMTP_USERNAME = "smartway686868@gmail.com";
    //    private final String SMTP_PASSWORD = "smartway@123"; jjdxmfvhjnbduiby
    private final String SMTP_PASSWORD = "jjdxmfvhjnbduiby";

    @Override
    public void sendMail(String to, String subject, String body) {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", SMTP_HOST);
        props.put("mail.smtp.port", SMTP_PORT);

        // PasswordAuthentication
        PasswordAuthentication passwordAuthentication = new PasswordAuthentication(SMTP_USERNAME, SMTP_PASSWORD);

        Session session = Session.getInstance(
            props,
            new javax.mail.Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return passwordAuthentication;
                }
            }
        );

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(SMTP_USERNAME));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);
            message.setText(body);

            Transport.send(message);

            System.out.println("Email sent successfully!");
        } catch (MessagingException e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }
}
