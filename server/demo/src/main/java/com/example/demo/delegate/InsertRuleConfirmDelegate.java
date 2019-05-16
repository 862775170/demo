package com.example.demo.delegate;

import java.time.LocalTime;

import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;

import com.example.demo.common.SpringUtils;
import com.example.demo.dao.RuleConfirmDao;
import com.example.demo.entity.RuleConfirm;

public class InsertRuleConfirmDelegate implements JavaDelegate {

	@Override
	public void execute(DelegateExecution execution) {
		RuleConfirmDao bean = SpringUtils.getBean(RuleConfirmDao.class);
		RuleConfirm entity = new RuleConfirm();
		Integer ruleId = execution.getVariable("ruleId", Integer.class);
		String savePath = execution.getVariable("savePath", String.class);
		Integer userId = execution.getVariable("userId", Integer.class);
		entity.setRuleId(ruleId);
		entity.setSavePath(savePath);
		entity.setUserId(userId);
		entity.setCreateBy(userId);
		entity.setCreateTime(LocalTime.now());
		bean.save(entity);
	}

}
