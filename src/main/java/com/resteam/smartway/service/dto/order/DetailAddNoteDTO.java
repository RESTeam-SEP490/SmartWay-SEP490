package com.resteam.smartway.service.dto.order;

import java.util.UUID;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DetailAddNoteDTO {

    @NotNull
    private UUID orderDetailId;

    @NotNull
    private String note;
}
