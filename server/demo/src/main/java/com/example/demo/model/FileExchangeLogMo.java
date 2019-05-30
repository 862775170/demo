package com.example.demo.model;

import com.example.demo.entity.FileExchangeLog;

public class FileExchangeLogMo extends FileExchangeLog {
	private Integer ruleName;
	private String sourceUserName;
	private String targetUserName;

	public Integer getRuleName() {
		return ruleName;
	}

	public void setRuleName(Integer ruleName) {
		this.ruleName = ruleName;
	}

	public String getSourceUserName() {
		return sourceUserName;
	}

	public void setSourceUserName(String sourceUserName) {
		this.sourceUserName = sourceUserName;
	}

	public String getTargetUserName() {
		return targetUserName;
	}

	public void setTargetUserName(String targetUserName) {
		this.targetUserName = targetUserName;
	}

}
