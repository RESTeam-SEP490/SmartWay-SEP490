package com.resteam.smartway.repository;

import com.resteam.smartway.domain.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffRepository extends JpaRepository<User, UUID> {
    @Query(value = "select * from jhi_user as u inner join role as r on u.role_id = r.id\n" + "where r.name = 'Staff'", nativeQuery = true)
    List<User> getAllStaff();

    Optional<User> findOneByUsername(String username);
}
