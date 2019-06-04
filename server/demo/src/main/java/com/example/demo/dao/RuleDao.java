package com.example.demo.dao;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Rule;

public interface RuleDao extends JpaRepository<Rule, Integer> {

	List<Rule> findByUserId(String userId);

	Rule findByRuleId(Integer ruleId);

	List<Rule> findByRuleIdIn(Collection<Integer> ruleIds);

	List<Rule> findByUserIdAndDeleteTimeIsNull(String userId);
}