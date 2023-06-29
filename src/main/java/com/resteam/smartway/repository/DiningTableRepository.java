package com.resteam.smartway.repository;

import com.resteam.smartway.domain.DiningTable;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiningTableRepository extends JpaRepository<DiningTable, UUID> {}
