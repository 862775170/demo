package com.example.demo.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.common.ObjectUtils;
import com.example.demo.dao.FileExchangeLogDao;
import com.example.demo.dao.FileSendHisDao;
import com.example.demo.entity.FileExchangeLog;
import com.example.demo.entity.FileSendHis;
import com.example.demo.service.FileSendHisService;
import com.example.demo.service.FileService;
import com.example.demo.service.RuleService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class FileSendHisServiceImpl implements FileSendHisService {
	@Autowired
	private FileSendHisDao fileSendHisDao;
	@Autowired
	private RuleService ruleService;
	@Autowired
	private FileService fileService;
	@Autowired
	private FileExchangeLogDao fileExchangeLogDao;

	@Override
	public void addFileSendHis(String userId, Integer ruleId, Integer fileNumber, String fileId, String fileName,
			Date uploadTime) {
		FileSendHis entity = new FileSendHis();
		entity.setUserId(userId);
		entity.setFileId(fileId);
		entity.setRuleId(ruleId);
		entity.setFileNumber(fileNumber);
		entity.setUploadTime(uploadTime);
		entity.setFileName(fileName);
		fileSendHisDao.save(entity);
	}

	@Override
	public Page<Map<String, Object>> getFileSendHis(FileSendHis probe, Pageable pageable) {

		Set<Integer> ruleIds = new HashSet<>();
		Page<FileSendHis> findAll = fileSendHisDao.findAll(Example.of(probe), pageable);
		findAll.forEach(a -> {
			if (a.getRuleId() != null) {
				ruleIds.add(a.getRuleId());
			}
		});
		Map<Integer, String> ruleMap = ruleService.getRuleMap(ruleIds);
		return findAll.map(a -> {
			Map<String, Object> objectToMap = ObjectUtils.objectToMap(a);
			objectToMap.put("ruleName", ruleMap.get(a.getRuleId()));
			FileExchangeLog exchangeLog = new FileExchangeLog();
			exchangeLog.setRuleId(a.getRuleId());
			exchangeLog.setSourceUserId(a.getUserId());
			exchangeLog.setSendTime(a.getUploadTime());
			exchangeLog.setSourceFileId(a.getFileId());
			objectToMap.put("confirmNumber", fileExchangeLogDao.count(Example.of(exchangeLog)));
			return objectToMap;
		});
	}

}
