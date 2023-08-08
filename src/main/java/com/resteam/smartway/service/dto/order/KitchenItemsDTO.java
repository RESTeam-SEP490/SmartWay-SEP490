package com.resteam.smartway.service.dto.order;

import com.resteam.smartway.service.dto.order.notification.ItemAdditionNotificationDTO;
import com.resteam.smartway.service.dto.order.notification.ReadyToServeNotificationDTO;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KitchenItemsDTO {

    List<ItemAdditionNotificationDTO> itemAdditionNotificationList;
    List<ReadyToServeNotificationDTO> readyToServeNotificationList;
}
