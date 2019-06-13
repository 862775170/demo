package com.example.demo.service.impl;

import java.util.Date;
import java.util.List;

import javax.persistence.criteria.Predicate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.common.DateUtils;
import com.example.demo.dao.RuleFileDao;
import com.example.demo.entity.RuleFile;
import com.example.demo.service.RuleFileService;

@Service
public class RuleFileServiceImpl implements RuleFileService {
	@Autowired
	private RuleFileDao ruleFileDao;

	@Override
	public void saveRuleFile(Integer ruleId, String fileId, Date uploadTime, String sourceFileId,
			String sourceFullPathName, String sourceUserId, String sourceFileName) {
		RuleFile entity = new RuleFile();
		entity.setCreateTime(new Date());
		entity.setFileId(fileId);
		entity.setRuleId(ruleId);
		entity.setUploadTime(uploadTime);
		entity.setSourceFileId(sourceFileId);
		entity.setSourceFullPath(sourceFullPathName);
		entity.setSourceUserId(sourceUserId);
		entity.setSourceFileName(sourceFileName);
		ruleFileDao.save(entity);
	}

	@Override
	public List<RuleFile> getAllRuleFile(Integer ruleId) {
		return ruleFileDao.findByRuleId(ruleId);
	}

	@Override
	public List<RuleFile> getToDayRuleFile(Integer ruleId) {
		Date date = new Date();
		Date startOfDay = DateUtils.getStartOfDay(date);
		Date endOfDay = DateUtils.getEndOfDay(date);
		return ruleFileDao.findAll((root, query, criteriaBuilder) -> {
			Predicate equal = criteriaBuilder.equal(root.get("ruleId"), ruleId);
			Predicate lessThanOrEqualTo = criteriaBuilder.lessThanOrEqualTo(root.get("uploadTime").as(Date.class),
					endOfDay);
			Predicate greaterThanOrEqualTo = criteriaBuilder.greaterThanOrEqualTo(root.get("uploadTime").as(Date.class),
					startOfDay);
			return criteriaBuilder.and(equal, lessThanOrEqualTo, greaterThanOrEqualTo);
		});
	}

}
