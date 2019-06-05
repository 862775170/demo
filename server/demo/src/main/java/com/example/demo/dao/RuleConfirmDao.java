package com.example.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.RuleConfirm;

public interface RuleConfirmDao extends JpaRepository<RuleConfirm, Integer> {

	List<RuleConfirm> findByRuleId(Integer ruleId);

	List<RuleConfirm> findByRuleIdIn(List<Integer> ruleIds);

	List<RuleConfirm> findByUserId(String userId);

	List<RuleConfirm> findByRuleIdAndDeleteTimeIsNull(Integer ruleId);

	Long countByUserIdAndDeleteTimeIsNull(String userId);

	Long countByRuleId(Integer ruleId);

}
