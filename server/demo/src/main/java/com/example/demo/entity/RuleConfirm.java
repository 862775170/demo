package com.example.demo.entity;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Transient;

@Entity
public class RuleConfirm {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

	private Integer ruleId;

	private String saveFileId;
	@Column(length = 2048)
	private String savePath;
	@Column(length = 2048)
	private String savePathName;

	private String userId;

	private String createBy;

	private Date createTime;

	private Date deleteTime;

	private String deleteBy;

	private String rootIds;
	@Column(name = "`desc`")
	private String desc;

	private Date confirmTime;

	private String confirmBy;

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

	public String getSavePath() {
		return savePath;
	}

	public void setSavePath(String savePath) {
		this.savePath = savePath;
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

	public Date getDeleteTime() {
		return deleteTime;
	}

	public void setDeleteTime(Date deleteTime) {
		this.deleteTime = deleteTime;
	}

	public String getSavePathName() {
		return savePathName;
	}

	public void setSavePathName(String savePathName) {
		this.savePathName = savePathName;
	}

	public String getRootIds() {
		return rootIds;
	}

	public void setRootIds(String rootIds) {
		this.rootIds = rootIds;
	}

	public String getSaveFileId() {
		return saveFileId;
	}

	public void setSaveFileId(String saveFileId) {
		this.saveFileId = saveFileId;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public Date getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Date confirmTime) {
		this.confirmTime = confirmTime;
	}

	public String getConfirmBy() {
		return confirmBy;
	}

	public void setConfirmBy(String confirmBy) {
		this.confirmBy = confirmBy;
	}

	public String getDeleteBy() {
		return deleteBy;
	}

	public void setDeleteBy(String deleteBy) {
		this.deleteBy = deleteBy;
	}

	@Override
	public String toString() {
		return "RuleConfirm [id=" + id + ", ruleId=" + ruleId + ", saveFileId=" + saveFileId + ", savePath=" + savePath
				+ ", savePathName=" + savePathName + ", userId=" + userId + ", createBy=" + createBy + ", createTime="
				+ createTime + ", deleteTime=" + deleteTime + ", deleteBy=" + deleteBy + ", rootIds=" + rootIds
				+ ", desc=" + desc + ", confirmTime=" + confirmTime + ", confirmBy=" + confirmBy + "]";
	}
}
