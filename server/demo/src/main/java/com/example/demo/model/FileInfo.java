package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonAlias;

public class FileInfo {
	@JsonAlias("fullpath")
	private String fullPath;
	@JsonAlias("isdir")
	private Boolean isdir;
	@JsonAlias("user_id")
	private String userId;
	@JsonAlias("file_id")
	private String fileId;
	@JsonAlias("filename_KeywordIkPinyin")
	private String filename;
	@JsonAlias("parent_id")
	private String parentId;

	public String getFullPath() {
		return fullPath;
	}

	public void setFullPath(String fullPath) {
		this.fullPath = fullPath;
	}

	public Boolean getIsdir() {
		return isdir;
	}

	public void setIsdir(Boolean isdir) {
		this.isdir = isdir;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getFileId() {
		return fileId;
	}

	public void setFileId(String fileId) {
		this.fileId = fileId;
	}

	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	@Override
	public String toString() {
		return "FileInfo [fullpath=" + fullPath + ", isdir=" + isdir + ", userId=" + userId + ", fileId=" + fileId
				+ ", filename=" + filename + ", parentId=" + parentId + "]";
	}
}
