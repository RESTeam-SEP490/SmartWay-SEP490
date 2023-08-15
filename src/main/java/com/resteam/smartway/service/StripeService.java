package com.resteam.smartway.service;

import com.google.gson.JsonSyntaxException;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.domain.User;
import com.resteam.smartway.domain.enumeration.PlanName;
import com.resteam.smartway.repository.RestaurantRepository;
import com.resteam.smartway.repository.UserRepository;
import com.resteam.smartway.security.SecurityUtils;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.net.ApiResource;
import com.stripe.net.Webhook;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import java.time.Instant;
import javax.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class StripeService {

    private final RestaurantRepository restaurantRepository;
    private final String MONTHLY_PRICE_ID = "price_1NfKE1A39ciAsOx6Q1mX5rRt";
    private final String PER_6_MONTH_PRICE_ID = "price_1NfKGjA39ciAsOx6PYVShxHU";
    private final String YEARLY_PRICE_ID = "price_1NfKHPA39ciAsOx6rOnz9w8L";

    @SneakyThrows
    public String initCheckOutSession(PlanName planName) {
        String priceId = "";
        switch (planName) {
            case YEARLY:
                priceId = YEARLY_PRICE_ID;
                break;
            case PER_6_MONTH:
                priceId = PER_6_MONTH_PRICE_ID;
                break;
            case MONTHLY:
                priceId = MONTHLY_PRICE_ID;
                break;
        }

        Restaurant restaurant = RestaurantContext.getCurrentRestaurant();

        String customerId;
        if (restaurant.getStripeCustomerId() == null) {
            customerId = createStripeCustomer(restaurant.getId());
            restaurant.setStripeCustomerId(customerId);
            restaurantRepository.save(restaurant);
        } else customerId = restaurant.getStripeCustomerId();

        SessionCreateParams params = SessionCreateParams
            .builder()
            .setCustomer(customerId)
            .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
            .setSuccessUrl("http://" + RestaurantContext.getCurrentRestaurant().getId() + ".localhost:9000")
            .setCancelUrl("http://" + RestaurantContext.getCurrentRestaurant().getId() + ".localhost:9000/page-not-found")
            .addLineItem(SessionCreateParams.LineItem.builder().setPrice(priceId).setQuantity(1L).build())
            .build();

        Session session = Session.create(params);

        return session.getUrl();
    }

    @PostConstruct
    private static void init() {
        Stripe.apiKey = "sk_test_51NFTwGA39ciAsOx6hZZpeieCrbcun2KiTnqiUjnSpZAsRotITuUiscO3O1DzHQmC9vIpYEmgJoNIdxZtiSdMIb1000egKwAlES";
    }

    public String createStripeCustomer(String name) throws StripeException {
        CustomerCreateParams customerParams = CustomerCreateParams.builder().setName(name).build();

        Customer customer = Customer.create(customerParams);

        return customer.getId();
    }

    public void handleSubscription(StripeObject stripeObject, Event event) {
        // Handle the event
        Subscription subscription = null;
        if (event.getType().equalsIgnoreCase("customer.subscription.updated")) {
            subscription = (Subscription) stripeObject;
            Long currentPeriodEndsInLong = subscription.getCurrentPeriodEnd();
            Instant currentPeriodEnds = Instant.ofEpochSecond(currentPeriodEndsInLong);
            Restaurant toUpdateRestaurant = restaurantRepository
                .findOneByStripeCustomerId(subscription.getCustomer())
                .orElseThrow(() -> new BadRequestAlertException("Restaurant not found", "restaurant", "idnotfound"));
            toUpdateRestaurant.setPlanExpiry(currentPeriodEnds);
            restaurantRepository.save(toUpdateRestaurant);
        }
    }
}
