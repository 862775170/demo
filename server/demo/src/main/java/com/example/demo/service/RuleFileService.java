package com.example.demo.service;

import java.util.Date;
import java.util.List;

import com.example.demo.entity.RuleFile;

public interface RuleFileService {
	void saveRuleFile(Integer ruleId, String fileId, Date uploadTime, String sourceFileId, String sourceFullPathName,
			String sourceUserId, String sourceFileName);

	List<RuleFile> getAllRuleFile(Integer ruleId);

	List<RuleFile> getToDayRuleFile(Integer ruleId);

}
