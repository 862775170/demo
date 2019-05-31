package com.example.demo.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.example.demo.message.FileCopyMessage;

@Entity
public class FileExchangeLog {
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
	@Column(length = 1024)
	private String sourceFullPath;

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
	@Column(length = 1024)
	private String targetFullPath;

	/**
	 * 拷贝目标人
	 */
	private String targetUserId;

	private String targetFileId;
	/**
	 * 拷贝后文件名
	 */
	private String targetFileName;

	private Date sendTime;
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

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getTargetFileName() {
		return targetFileName;
	}

	public void setTargetFileName(String targetFileName) {
		this.targetFileName = targetFileName;
	}

	public Date getSendTime() {
		return sendTime;
	}

	public void setSendTime(Date sendTime) {
		this.sendTime = sendTime;
	}

	public String getSourceFileId() {
		return sourceFileId;
	}

	public void setSourceFileId(String sourceFileId) {
		this.sourceFileId = sourceFileId;
	}

	public String getTargetFileId() {
		return targetFileId;
	}

	public void setTargetFileId(String targetFileId) {
		this.targetFileId = targetFileId;
	}
}
