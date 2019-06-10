package com.example.demo.dao;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.entity.FileExchangeLog;

public interface FileExchangeLogDao
		extends JpaRepository<FileExchangeLog, Integer>, JpaSpecificationExecutor<FileExchangeLog> {

	List<FileExchangeLog> findBySourceUserId(String userId);

	List<FileExchangeLog> findByTargetUserId(String userId);

	List<FileExchangeLog> findBySourceUserIdAndTargetUserId(String sourceUserId, String targetUserId);

	Long countByRuleId(Integer ruleId);

	Long countByRuleConfirmId(Integer ruleConfirmId);
//	List<FileExchangeLog> findByRuleIdGroupByTargetUserId(Integer ruleId);

	Long countByRuleIdAndTargetUserId(Integer ruleId, String targetUserId);

}
