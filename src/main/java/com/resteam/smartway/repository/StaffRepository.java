package com.resteam.smartway.repository;

import com.resteam.smartway.domain.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffRepository extends JpaRepository<User, UUID> {
    @Query(
        value = "select * from user as u inner join role as r on u.role_id = r.id\n" +
        "where r.name = 'Staff' and u.restaurant_id = :restaurantId",
        nativeQuery = true
    )
    List<User> getAllStaff(@Param("restaurantId") String restaurantId);

    Optional<User> findOneByUsername(String username);

    Optional<User> findUserByUsername(String username);
}
