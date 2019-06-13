package com.example.demo.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Rule {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer ruleId;

	private String ruleName;
	@Column(length = 2048)
	private String sourcePath;

	private String sourceFileId;
	@Column(length = 2048)
	private String sourcePathName;

	private String rootIds;

	private String userId;

	private String swapFolder;

	@Column(name = "`desc`")
	private String desc;
	private String createBy;

	private Date createTime;

	/**
	 */
	private Date deleteTime;

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

	public String getRootIds() {
		return rootIds;
	}

	public void setRootIds(String rootIds) {
		this.rootIds = rootIds;
	}

	public String getSourcePathName() {
		return sourcePathName;
	}

	public void setSourcePathName(String sourcePathName) {
		this.sourcePathName = sourcePathName;
	}

	public Date getDeleteTime() {
		return deleteTime;
	}

	public void setDeleteTime(Date deleteTime) {
		this.deleteTime = deleteTime;
	}

	public String getSourceFileId() {
		return sourceFileId;
	}

	public void setSourceFileId(String sourceFileId) {
		this.sourceFileId = sourceFileId;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getSwapFolder() {
		return swapFolder;
	}

	public void setSwapFolder(String swapFolder) {
		this.swapFolder = swapFolder;
	}

	@Override
	public String toString() {
		return "Rule [ruleId=" + ruleId + ", ruleName=" + ruleName + ", sourcePath=" + sourcePath + ", sourceFileId="
				+ sourceFileId + ", sourcePathName=" + sourcePathName + ", rootIds=" + rootIds + ", userId=" + userId
				+ ", desc=" + desc + ", createBy=" + createBy + ", createTime=" + createTime + ", deleteTime="
				+ deleteTime + "]";
	}

}
