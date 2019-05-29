package com.example.demo.message;

import java.util.Date;

public class FileCopyMessage {

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
	 * 源文件Id
	 */
	private String sourceFileId;
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
	private String targetFileName;

	/**
	 * 拷贝后文件Id
	 */
	private String targerFileId;

	/**
	 * 拷贝文件的父级目录
	 */
	private String targerParentId;
	/**
	 * 拷贝时间
	 */
	private Date sendTime;

	public Integer getRuleId() {
		return ruleId;
	}

	public void setRuleId(Integer ruleId) {
		this.ruleId = ruleId;
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

	public String getTargetFileName() {
		return targetFileName;
	}

	public void setTargetFileName(String targetFileName) {
		this.targetFileName = targetFileName;
	}

	public Integer getRuleConfirmId() {
		return ruleConfirmId;
	}

	public void setRuleConfirmId(Integer ruleConfirmId) {
		this.ruleConfirmId = ruleConfirmId;
	}

	public String getSourceFileId() {
		return sourceFileId;
	}

	public void setSourceFileId(String sourceFileId) {
		this.sourceFileId = sourceFileId;
	}

	public String getTargerFileId() {
		return targerFileId;
	}

	public void setTargerFileId(String targerFileId) {
		this.targerFileId = targerFileId;
	}

	public String getTargerParentId() {
		return targerParentId;
	}

	public void setTargerParentId(String targerParentId) {
		this.targerParentId = targerParentId;
	}

	public Date getSendTime() {
		return sendTime;
	}

	public void setSendTime(Date sendTime) {
		this.sendTime = sendTime;
	}
}
