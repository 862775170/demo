package com.example.demo.delegate;

import java.util.Date;

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
		String userId = execution.getVariable("userId", String.class);
		String saveFileId = execution.getVariable("saveFileId", String.class);
		String savePathName = execution.getVariable("savePathName", String.class);
		String rootIds = execution.getVariable("rootIds", String.class);
		entity.setRuleId(ruleId);
		entity.setSavePath(savePath);
		entity.setUserId(userId);
		entity.setCreateBy(userId);
		entity.setCreateTime(new Date());
		entity.setRootIds(rootIds);
		entity.setSavePathName(savePathName);
		entity.setSaveFileId(saveFileId);
		bean.save(entity);
	}

}
