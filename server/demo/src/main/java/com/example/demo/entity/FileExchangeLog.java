package com.example.demo.entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.example.demo.message.FileCopyMessage;

@Entity
public class FileExchangeLog extends FileCopyMessage {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

	/**
	 * 规则Id
	 */
	private Integer ruleId;

	/**
	 * 确认文件Id
	 */
	private Integer ruleConfirmId;
	/**
	 * 源文件全路径
	 */
	private String sourceFullPath;

	/**
	 * 源文件名称
	 */
	private String sourceFileName;

	/**
	 * 源文件所属人
	 */
	private String sourceUserId;

	/**
	 * 拷贝目标全路径
	 */
	private String targetFullPath;

	/**
	 * 拷贝目标人
	 */
	private String targetUserId;

	/**
	 * 拷贝后文件名
	 */
	private String targerFileName;

	/**
	 * 拷贝时间
	 */
	private Date createTime;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getRuleId() {
		return ruleId;
	}

	public void setRuleId(Integer ruleId) {
		this.ruleId = ruleId;
	}

	public Integer getRuleConfirmId() {
		return ruleConfirmId;
	}

	public void setRuleConfirmId(Integer ruleConfirmId) {
		this.ruleConfirmId = ruleConfirmId;
	}

	public String getSourceFullPath() {
		return sourceFullPath;
	}

	public void setSourceFullPath(String sourceFullPath) {
		this.sourceFullPath = sourceFullPath;
	}

	public String getSourceFileName() {
		return sourceFileName;
	}

	public void setSourceFileName(String sourceFileName) {
		this.sourceFileName = sourceFileName;
	}

	public String getSourceUserId() {
		return sourceUserId;
	}

	public void setSourceUserId(String sourceUserId) {
		this.sourceUserId = sourceUserId;
	}

	public String getTargetFullPath() {
		return targetFullPath;
	}

	public void setTargetFullPath(String targetFullPath) {
		this.targetFullPath = targetFullPath;
	}

	public String getTargetUserId() {
		return targetUserId;
	}

	public void setTargetUserId(String targetUserId) {
		this.targetUserId = targetUserId;
	}

	public String getTargerFileName() {
		return targerFileName;
	}

	public void setTargerFileName(String targerFileName) {
		this.targerFileName = targerFileName;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

}