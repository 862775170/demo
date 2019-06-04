package com.example.demo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

import com.example.demo.dao.RuleConfirmDao;
import com.example.demo.entity.RuleConfirm;
import com.example.demo.service.RuleConfirmService;

@Service
public class RuleConfirmServiceImpl implements RuleConfirmService {
	@Autowired
	private RuleConfirmDao ruleConfirmDao;

	@Override
	public Long countByUserId(String userId) {
		RuleConfirm ruleConfirm = new RuleConfirm();
		ruleConfirm.setUserId(userId);
		return ruleConfirmDao.count(Example.of(ruleConfirm));
	}

}
