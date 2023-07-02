package com.resteam.smartway.security;

import com.resteam.smartway.config.Constants;
import java.util.Optional;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

@Component
public class SpringSecurityAuditorAware implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        return Optional.of(SecurityUtils.getCurrentUsername().orElse(Constants.SYSTEM));
    }
}
