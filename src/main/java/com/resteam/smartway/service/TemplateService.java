package com.resteam.smartway.service;

import java.io.ByteArrayInputStream;
import org.springframework.web.multipart.MultipartFile;

public interface TemplateService {
    ByteArrayInputStream downloadExcelTemplate(String path, int indexSecret);

    boolean checkTypeFile(MultipartFile file);
}
