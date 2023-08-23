package com.resteam.smartway.web.stripe;

import com.google.gson.JsonSyntaxException;
import com.resteam.smartway.domain.enumeration.PlanName;
import com.resteam.smartway.service.StripeService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.StripeObject;
import com.stripe.net.ApiResource;
import com.stripe.net.Webhook;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
@Transactional
@RequiredArgsConstructor
public class SubscriptionCheckoutWebhook {

    private final StripeService stripeService;

    String endpointSecret = "whsec_z6TNwESeau5AQbZMDT0fTcFW0SWcTQJU";

    @PostMapping("/api/subscriptions/create-checkout-session")
    public ResponseEntity<String> getCheckoutSession(@RequestParam PlanName planName) {
        String checkOutUrl = stripeService.initCheckOutSession(planName);
        return ResponseEntity.ok().body(checkOutUrl);
    }

    @PostMapping("/api/subscriptions/create-portal-session")
    public ResponseEntity<String> getPortalSession() {
        String checkOutUrl = stripeService.initPortalSession();
        return ResponseEntity.ok().body(checkOutUrl);
    }

    @PostMapping("/api/subscriptions/create-account-link-session")
    public ResponseEntity<String> getAccountLinkSession() {
        String checkOutUrl = stripeService.initCreateAccountSession();
        return ResponseEntity.ok().body(checkOutUrl);
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> handleSubscription(@RequestHeader("Stripe-Signature") String sigHeader, @RequestBody String payload) {
        Event event = null;
        try {
            event = ApiResource.GSON.fromJson(payload, Event.class);
        } catch (JsonSyntaxException e) {
            // Invalid payload
            System.out.println("⚠️  Webhook error while parsing basic request.");
            return ResponseEntity.badRequest().build();
        }
        if (endpointSecret != null && sigHeader != null) {
            // Only verify the event if you have an endpoint secret defined.
            // Otherwise use the basic event deserialized with GSON.
            try {
                event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
            } catch (SignatureVerificationException e) {
                // Invalid signature
                System.out.println("⚠️  Webhook error while validating signature.");
                return ResponseEntity.badRequest().build();
            }
        }
        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject = null;
        if (dataObjectDeserializer.getObject().isPresent()) {
            stripeObject = dataObjectDeserializer.getObject().get();
        } else return ResponseEntity.badRequest().build();

        stripeService.handleSubscription(stripeObject, event);
        return ResponseEntity.ok().build();
    }
}
