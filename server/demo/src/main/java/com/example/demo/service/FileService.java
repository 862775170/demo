package com.example.demo.service;

import java.util.Map;

import com.example.demo.model.FileInfo;

public interface FileService extends FileXService {
	/**
	 * 全路径Id 转换 全路径name
	 * 
	 * @param fullPath 全路径ID
	 * @param rootIds  用户rootIds
	 * @return
	 */
	String getFileFullPath(String fullPath, String rootIds);

	/**
	 * 根据 fileId 获得文件 信息
	 * 
	 * @param fileId
	 * @return
	 */
	FileInfo getFineInfo(String fileId);

	/**
	 * 复制文件接口
	 * 
	 * @param sourceFileId 源文件Id
	 * @param parentId     保存目录
	 * @param displayName  文件名
	 * @param targetUserId 用户Id
	 * @return
	 */
	FileInfo copyObject(String sourceFileId, String parentId, String displayName, String targetUserId);

	/**
	 * 创建目录
	 * 
	 * @param parentFileId 上级目录
	 * @param fileName     目录名字
	 * @param userId       目录所属人
	 * @return
	 */
	FileInfo createFolder(String parentFileId, String fileName, String userId);
}
