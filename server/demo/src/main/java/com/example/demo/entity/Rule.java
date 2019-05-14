package com.example.demo.entity;

import java.time.LocalTime;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class Rule {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer ruleId;

	private String ruleName;
	private String sourcePath;

	private Integer userId;

	private Integer createBy;

	private LocalTime createTime;
	@OneToMany(mappedBy = "rule")
	private List<RuleTarget> ruleTargets;

	public List<RuleTarget> getRuleTargets() {
		return ruleTargets;
	}

	public void setRuleTargets(List<RuleTarget> ruleTargets) {
		this.ruleTargets = ruleTargets;
	}

	public Integer getRuleId() {
		return ruleId;
	}

	public void setRuleId(Integer ruleId) {
		this.ruleId = ruleId;
	}

	public String getRuleName() {
		return ruleName;
	}

	public void setRuleName(String ruleName) {
		this.ruleName = ruleName;
	}

	public String getSourcePath() {
		return sourcePath;
	}

	public void setSourcePath(String sourcePath) {
		this.sourcePath = sourcePath;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public Integer getCreateBy() {
		return createBy;
	}

	public void setCreateBy(Integer createBy) {
		this.createBy = createBy;
	}

	public LocalTime getCreateTime() {
		return createTime;
	}

	public void setCreateTime(LocalTime createTime) {
		this.createTime = createTime;
	}
}
