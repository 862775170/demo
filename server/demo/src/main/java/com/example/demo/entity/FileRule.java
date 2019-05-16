package com.example.demo.entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * 文件传输规则表
 * 
 * @author HL-ACER
 *
 */
@Entity
public class FileRule {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long ruleId;

	private String fileRuleName;

	private String fileRegExp;

//	private String cron;

	private String userId;

	private String createBy;

	private Date createTime;

	public Long getRuleId() {
		return ruleId;
	}

	public void setRuleId(Long ruleId) {
		this.ruleId = ruleId;
	}

	public String getFileRuleName() {
		return fileRuleName;
	}

	public void setFileRuleName(String fileRuleName) {
		this.fileRuleName = fileRuleName;
	}

	public String getFileRegExp() {
		return fileRegExp;
	}

	public void setFileRegExp(String fileRegExp) {
		this.fileRegExp = fileRegExp;
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
