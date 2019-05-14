package com.example.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.RuleTarget;

public interface RuleTargetDao extends JpaRepository<RuleTarget, Integer> {

	List<RuleTarget> findByRuleId(Integer ruleId);

	List<RuleTarget> findByRuleIdIn(List<Integer> ruleIds);

	List<RuleTarget> findByUserId(Integer userId);

}
