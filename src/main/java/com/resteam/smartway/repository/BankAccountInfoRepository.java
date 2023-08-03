package com.resteam.smartway.repository;

import com.resteam.smartway.domain.BankAccountInfo;
import com.resteam.smartway.security.multitenancy.repository.BaseRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BankAccountInfoRepository extends BaseRepository<BankAccountInfo> {}
