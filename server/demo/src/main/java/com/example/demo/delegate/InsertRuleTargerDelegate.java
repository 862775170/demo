package com.example.demo.delegate;

import java.time.LocalTime;

import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;

import com.example.demo.common.SpringUtils;
import com.example.demo.dao.RuleTargetDao;
import com.example.demo.entity.RuleTarget;

public class InsertRuleTargerDelegate implements JavaDelegate {

	@Override
	public void execute(DelegateExecution execution) {
		RuleTargetDao bean = SpringUtils.getBean(RuleTargetDao.class);
		RuleTarget entity = new RuleTarget();
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
