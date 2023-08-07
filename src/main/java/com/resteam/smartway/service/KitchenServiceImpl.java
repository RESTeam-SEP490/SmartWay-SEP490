package com.resteam.smartway.service;

import com.resteam.smartway.domain.order.OrderDetail;
import com.resteam.smartway.domain.order.notifications.ItemAdditionNotification;
import com.resteam.smartway.domain.order.notifications.ItemCancellationNotification;
import com.resteam.smartway.domain.order.notifications.ReadyToServeNotification;
import com.resteam.smartway.repository.order.ItemAdditionNotificationRepository;
import com.resteam.smartway.repository.order.OrderDetailRepository;
import com.resteam.smartway.repository.order.ReadyToServeNotificationRepository;
import com.resteam.smartway.service.dto.order.KitchenItemsDTO;
import com.resteam.smartway.service.dto.order.notification.NotifyReadyToServeDTO;
import com.resteam.smartway.service.dto.order.notification.NotifyServedDTO;
import com.resteam.smartway.service.mapper.order.notification.ItemAdditionNotificationMapper;
import com.resteam.smartway.service.mapper.order.notification.ReadyToServeNotificationMapper;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class KitchenServiceImpl implements KitchenService {

    private final ItemAdditionNotificationRepository itemAdditionNotificationRepository;
    private final ReadyToServeNotificationRepository readyToServeNotificationRepository;
    private final ItemAdditionNotificationMapper itemAdditionNotificationMapper;
    private final ReadyToServeNotificationMapper readyToServeNotificationMapper;
    private final OrderDetailRepository orderDetailRepository;

    @Override
    public KitchenItemsDTO getAllOrderItemInKitchen() {
        List<ItemAdditionNotification> additionNotificationList = itemAdditionNotificationRepository.findByIsCompleted(false);
        List<ReadyToServeNotification> readyToServeNotificationList = readyToServeNotificationRepository.findByIsCompleted(false);
        return new KitchenItemsDTO(
            itemAdditionNotificationMapper.toDto(additionNotificationList),
            readyToServeNotificationMapper.toDto(readyToServeNotificationList)
        );
    }

    @Override
    public ReadyToServeNotification markReadyToServe(NotifyReadyToServeDTO dto) {
        ItemAdditionNotification itemAdditionNotification = itemAdditionNotificationRepository
            .findByIdAndIsCompleted(dto.getItemAdditionNotificationId(), false)
            .orElseThrow(() -> new BadRequestAlertException("Order item was not found or completed", "kitchenItems", "notfound"));

        int preparingQuantity = itemAdditionNotification.getQuantity();
        for (ReadyToServeNotification rts : itemAdditionNotification.getReadyToServeNotificationList()) {
            preparingQuantity -= rts.getQuantity();
        }
        for (ItemCancellationNotification icn : itemAdditionNotification.getItemCancellationNotificationList()) {
            preparingQuantity -= icn.getQuantity();
        }

        if (preparingQuantity < dto.getReadyToServeQuantity()) throw new BadRequestAlertException(
            "Ready-to-serve quantity is more than ordered quantity",
            "kitchenItems",
            "quantityInvalid"
        );

        Optional<ReadyToServeNotification> readyToServeNotificationOptional = readyToServeNotificationRepository.findByItemAdditionNotificationAndIsCompleted(
            itemAdditionNotification,
            false
        );

        if (preparingQuantity == 0 || dto.getReadyToServeQuantity() == 0) {
            itemAdditionNotification.setCompleted(true);
            itemAdditionNotificationRepository.saveAndFlush(itemAdditionNotification);
            return null;
        }

        ReadyToServeNotification readyToServeNotification;
        if (readyToServeNotificationOptional.isPresent()) {
            readyToServeNotification = readyToServeNotificationOptional.get();
            readyToServeNotification.setQuantity(readyToServeNotification.getQuantity() + dto.getReadyToServeQuantity());
        } else {
            readyToServeNotification = new ReadyToServeNotification();
            readyToServeNotification.setItemAdditionNotification(itemAdditionNotification);
            readyToServeNotification.setQuantity(dto.getReadyToServeQuantity());
            readyToServeNotification.setServedQuantity(0);
            itemAdditionNotification.getReadyToServeNotificationList().add(readyToServeNotification);
        }

        if (preparingQuantity - dto.getReadyToServeQuantity() == 0) {
            itemAdditionNotification.setCompleted(true);
        }

        itemAdditionNotificationRepository.saveAndFlush(itemAdditionNotification);
        return readyToServeNotification;
    }

    @Override
    public ReadyToServeNotification markServed(NotifyServedDTO dto) {
        ReadyToServeNotification readyToServeNotification = readyToServeNotificationRepository
            .findByIdAndIsCompleted(dto.getReadyToServeNotificationId(), false)
            .orElseThrow(() ->
                new BadRequestAlertException(
                    "Ready-to-serve notification was not found or already completed",
                    "readyToServeNotification",
                    "notfound"
                )
            );
        int notServedQuantity = readyToServeNotification.getQuantity() - readyToServeNotification.getServedQuantity();
        for (ItemCancellationNotification icn : readyToServeNotification.getItemCancellationNotificationList()) {
            notServedQuantity -= icn.getQuantity();
        }
        if (notServedQuantity < dto.getServedQuantity()) throw new BadRequestAlertException(
            "Served quantity is more than ready-to-serve quantity",
            "kitchenItems",
            "quantityInvalid"
        );

        if (notServedQuantity == 0 && dto.getServedQuantity() == 0) {
            readyToServeNotification.setCompleted(true);
            return readyToServeNotificationRepository.save(readyToServeNotification);
        }

        OrderDetail orderDetail = readyToServeNotification.getItemAdditionNotification().getOrderDetail();
        orderDetail.setServedQuantity(orderDetail.getServedQuantity() + dto.getServedQuantity());
        orderDetailRepository.save(orderDetail);

        readyToServeNotification.setServedQuantity(readyToServeNotification.getServedQuantity() + dto.getServedQuantity());
        if (notServedQuantity == dto.getServedQuantity()) {
            readyToServeNotification.setCompleted(true);
        }

        return readyToServeNotificationRepository.saveAndFlush(readyToServeNotification);
    }
}
