package com.example.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.example.demo.entity.RuleFile;

public interface RuleFileDao extends JpaRepository<RuleFile, Integer>, JpaSpecificationExecutor<RuleFile> {

	List<RuleFile> findByRuleId(Integer ruleId);

}
