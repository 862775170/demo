package com.example.demo.dao;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.RuleConfirm;

public interface RuleConfirmDao extends JpaRepository<RuleConfirm, Integer> {

	List<RuleConfirm> findByRuleId(Integer ruleId);

	List<RuleConfirm> findByRuleIdIn(List<Integer> ruleIds);

	List<RuleConfirm> findByUserId(String userId);

	List<RuleConfirm> findByRuleIdAndDeleteTimeIsNull(Integer ruleId);

	Long countByUserIdAndDeleteTimeIsNull(String userId);

	Long countByRuleId(Integer ruleId);

	List<RuleConfirm> findByRuleIdInAndUserId(List<Integer> ruleIds, String userId);

	Page<RuleConfirm> findByRuleIdInAndUserId(List<Integer> ruleIds, String userId, Pageable pageable);

	List<RuleConfirm> findByUserIdAndConfirmTimeIsNull(String userId);

	List<RuleConfirm> findByRuleIdAndDeleteTimeIsNullAndConfirmTimeIsNotNull(Integer ruleId);

	RuleConfirm findByRuleIdAndUserIdAndDeleteTimeIsNull(Integer ruleId, String userId);

	List<RuleConfirm> findByRuleIdAndUserIdNotIn(Integer ruleId, Set<String> userIds);

	List<RuleConfirm> findByUserIdAndConfirmTimeIsNullAndDeleteTimeIsNull(String assignee);

}
