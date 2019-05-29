package com.example.demo.service;

import java.util.Map;

import com.example.demo.model.FileInfo;

public interface FileService {
	String getFileFullPath(String fullPath, String rootIds);

	FileInfo getFineInfo(String fileId);

	/**
	 * @param sourceFileId 源文件Id
	 * @param parentId     保存目录
	 * @param displayName  文件名
	 * @param targetUserId 用户Id
	 */
	void copyObject(String sourceFileId, String parentId, String displayName, String targetUserId);
}
