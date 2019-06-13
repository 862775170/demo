package com.example.demo.service;

public interface FileXService {
	/**
	 * 拷贝文件到 交换空间
	 * 
	 * @param fileId       文件Id
	 * @param parentFileId 规则文件交换目录Id
	 * @param fileName     文件名字
	 * @return 新的文件Id
	 */
	String copyToSwap(String fileId, String parentFileId, String fileName);

	/**
	 * 创建交换空间下面的 目录 每一个规则对于交换空间下面一个目录
	 * 
	 * @param ruleId 规则Id
	 * @return
	 */
	String createRuleSwap(String ruleId);
}
