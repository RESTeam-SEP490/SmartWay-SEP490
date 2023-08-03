package com.resteam.smartway.service;

import com.resteam.smartway.service.dto.DiningTableDTO;
import com.resteam.smartway.service.dto.order.*;
import com.resteam.smartway.service.dto.order.notification.ItemAdditionNotificationDTO;
import com.resteam.smartway.service.dto.order.notification.OrderDetailPriorityDTO;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;

public interface OrderService {
    OrderDTO createOrder(OrderCreationDTO orderDTO);

    OrderDTO adjustDetailQuantity(OrderDetailAdjustQuantityDTO dto);

    OrderDTO addOrderDetail(OrderDetailAdditionDTO orderDetailDTO);

    OrderDTO notifyKitchen(UUID orderId);

    List<OrderDTO> getAllActiveOrders();

    OrderDTO deleteOrderDetail(UUID orderDetailId);

    OrderDTO addNoteToOrderDetail(DetailAddNoteDTO dto);

    OrderDTO groupTables(OrderDTO orderDTO, List<String> ids);

    OrderDTO findById(UUID orderId);

    void ungroupTables(UUID orderId, List<String> tableIds);
    OrderDTO splitOrder(UUID orderId, UUID targetTableId, List<UUID> orderDetailIds);

    OrderDTO changePriority(OrderDetailPriorityDTO orderDetailDTO);

    List<ItemAdditionNotificationDTO> getAllOrderItemInKitchen();
}
