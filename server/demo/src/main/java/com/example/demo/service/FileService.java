package com.example.demo.service;

import java.util.Map;

import com.example.demo.model.FileInfo;

public interface FileService {
	String getFileFullPath(String fullPath, String rootIds);

	FileInfo getFineInfo(String fileId);

	/**
	 * @param sourceFileId
	 * @param targetfileName
	 * @param targetParentId
	 * @param meta
	 * @return fileId
	 */
	void copyObject(String sourceFileId, String targetFileId, String displayName, Map<String, Object> meta);
}
