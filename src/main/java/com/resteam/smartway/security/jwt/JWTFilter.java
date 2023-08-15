package com.resteam.smartway.security.jwt;

import com.resteam.smartway.config.ApplicationProperties;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.security.CustomUserDetails;
import com.resteam.smartway.security.SecurityUtils;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

public class JWTFilter extends GenericFilterBean {

    public static final String AUTHORIZATION_HEADER = "Authorization";

    public static final String RESTAURANT_ID_HEADER = "x-restaurant-subdomain";

    public static final String AUTHORIZATION_TOKEN = "access_token";

    private final TokenProvider tokenProvider;

    public JWTFilter(TokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
        throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        String jwt = resolveToken(httpServletRequest);
        String subdomain = resolveSubdomain(httpServletRequest);

        if (StringUtils.hasText(subdomain) && StringUtils.hasText(jwt) && this.tokenProvider.validateToken(jwt)) {
            Authentication authentication = this.tokenProvider.getAuthentication(jwt);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            Restaurant restaurant = ((CustomUserDetails) authentication.getPrincipal()).getRestaurant();
            if (!restaurant.getId().equals(subdomain)) throw new BadCredentialsException("Restaurant subdomain not match!");
            RestaurantContext.setCurrentRestaurant(restaurant);
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        String jwt = request.getParameter(AUTHORIZATION_TOKEN);
        if (StringUtils.hasText(jwt)) {
            return jwt;
        }
        return null;
    }

    private String resolveSubdomain(HttpServletRequest request) {
        String headerSubdomain = request.getHeader(RESTAURANT_ID_HEADER);
        if (StringUtils.hasText(headerSubdomain)) {
            return headerSubdomain;
        }
        String subdomain = request.getHeader("host").split("[.]")[0];
        if (StringUtils.hasText(subdomain) && !subdomain.equals("www")) {
            return subdomain;
        }
        return null;
    }
}
