package com.example.demo.entity;

import java.util.Date;
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

	private String userId;

	private String createBy;

	private Date createTime;
	@OneToMany(mappedBy = "rule")
	private List<RuleConfirm> ruleTargets;

	public List<RuleConfirm> getRuleTargets() {
		return ruleTargets;
	}

	public void setRuleTargets(List<RuleConfirm> ruleTargets) {
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

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getCreateBy() {
		return createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

}
