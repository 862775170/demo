package com.example.demo.delegate;

import java.time.LocalTime;

import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;

import com.example.demo.common.SpringUtils;
import com.example.demo.dao.RuleDao;
import com.example.demo.entity.Rule;

/**
 * 写库Rule
 * 
 * @author chenjian2
 *
 */
public class InsertRuleDelegate implements JavaDelegate {

	@Override
	public void execute(DelegateExecution execution) {
		RuleDao bean = SpringUtils.getBean(RuleDao.class);
		Rule entity = new Rule();
		String sourcePath = execution.getVariable("sourcePath", String.class);
		Integer userId = execution.getVariable("userId", Integer.class);
		String ruleName = execution.getVariable("ruleName", String.class);
		Integer createBy = execution.getVariable("createBy", Integer.class);
		entity.setSourcePath(sourcePath);
		entity.setRuleName(ruleName);
		entity.setUserId(userId);
		entity.setCreateBy(createBy);
		entity.setCreateTime(LocalTime.now());
		bean.save(entity);
		execution.setVariable("ruleId", entity.getRuleId());
	}

}
