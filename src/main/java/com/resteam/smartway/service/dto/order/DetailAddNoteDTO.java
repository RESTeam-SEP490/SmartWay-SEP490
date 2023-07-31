package com.resteam.smartway.service.dto.order;

import java.util.UUID;
import lombok.Data;

@Data
public class DetailAddNoteDTO {

    private UUID orderDetailId;
    private String note;
}
