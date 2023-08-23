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
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;
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
    private final String MONTHLY_PRICE_ID = "price_1NiGMMA39ciAsOx6VvjDab7V";
    private final String PER_6_MONTHS_PRICE_ID = "price_1NiGMMA39ciAsOx6fkpqhFFF";
    private final String YEARLY_PRICE_ID = "price_1NiGMMA39ciAsOx6iKUceZlW";

    @SneakyThrows
    public String initCheckOutSession(PlanName planName) {
        String priceId = "";
        switch (planName) {
            case YEARLY:
                priceId = YEARLY_PRICE_ID;
                break;
            case PER_6_MONTHS:
                priceId = PER_6_MONTHS_PRICE_ID;
                break;
            case MONTHLY:
                priceId = MONTHLY_PRICE_ID;
                break;
        }

        Restaurant restaurant = restaurantRepository
            .findOneById(RestaurantContext.getCurrentRestaurant().getId())
            .orElseThrow(() -> new BadRequestAlertException("Restaurant not found", "restaurant", "idnotfound"));

        SessionCreateParams params = SessionCreateParams
            .builder()
            .setCustomer(restaurant.getStripeCustomerId())
            .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
            .setSuccessUrl("https://" + RestaurantContext.getCurrentRestaurant().getId() + ".smart-way.website/restaurant-setting")
            .setCancelUrl("https://" + RestaurantContext.getCurrentRestaurant().getId() + ".smart-way.website/restaurant-setting")
            .addLineItem(SessionCreateParams.LineItem.builder().setPrice(priceId).setQuantity(1L).build())
            .build();

        Session session = Session.create(params);

        return session.getUrl();
    }

    @SneakyThrows
    public String initPortalSession() {
        Restaurant restaurant = restaurantRepository
            .findOneById(RestaurantContext.getCurrentRestaurant().getId())
            .orElseThrow(() -> new BadRequestAlertException("Restaurant not found", "restaurant", "idnotfound"));
        com.stripe.param.billingportal.SessionCreateParams params = new com.stripe.param.billingportal.SessionCreateParams.Builder()
            .setCustomer(restaurant.getStripeCustomerId())
            .setReturnUrl("http://" + RestaurantContext.getCurrentRestaurant().getId() + ".localhost:9000")
            .build();

        com.stripe.model.billingportal.Session portalSession = com.stripe.model.billingportal.Session.create(params);
        return portalSession.getUrl();
    }

    @PostConstruct
    private static void init() {
        Stripe.apiKey = "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";
    }

    public String createStripeCustomer(String name, String email) throws StripeException {
        CustomerCreateParams customerParams = CustomerCreateParams.builder().setName(name).setEmail(email).build();
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
            toUpdateRestaurant.setStripeSubscriptionId(subscription.getId());

            restaurantRepository.save(toUpdateRestaurant);
        }
    }

    @SneakyThrows
    public String initCreateAccountSession() {
        Restaurant restaurant = restaurantRepository
            .findOneById(RestaurantContext.getCurrentRestaurant().getId())
            .orElseThrow(() -> new BadRequestAlertException("Restaurant not found", "restaurant", "idnotfound"));
        AccountCreateParams params = AccountCreateParams
            .builder()
            .setType(AccountCreateParams.Type.STANDARD)
            .setEmail(restaurant.getOwner().getEmail())
            .setDefaultCurrency(restaurant.getCurrencyUnit().toString())
            .build();

        Account account = Account.create(params);

        AccountLinkCreateParams params2 = AccountLinkCreateParams
            .builder()
            .setAccount(account.getId())
            .setRefreshUrl("https://example.com/reauth")
            .setReturnUrl("https://example.com/return")
            .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
            .build();

        AccountLink accountLink = AccountLink.create(params2);
        return accountLink.getUrl();
    }
}
