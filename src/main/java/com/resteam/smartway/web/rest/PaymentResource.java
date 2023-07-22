package com.resteam.smartway.web.rest;

import com.resteam.smartway.service.dto.CreatePayment;
import com.resteam.smartway.service.dto.CreatePaymentResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentResource {

    @PostMapping("/create-payment-intent")
    public CreatePaymentResponse createPaymentIntent(CreatePayment createPayment) throws StripeException {
        PaymentIntentCreateParams createParams = new PaymentIntentCreateParams.Builder().setCurrency("usd").setAmount(15 * 100L).build();

        // Create a PaymentIntent with the order amount and currency
        PaymentIntent intent = PaymentIntent.create(createParams);
        return new CreatePaymentResponse(intent.getClientSecret());
    }
}
