package com.resteam.smartway.repository;

import com.resteam.smartway.domain.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffRepository extends JpaRepository<User, UUID> {
    Optional<User> findOneByUsername(String username);
}
