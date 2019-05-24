package com.example.demo.delegate;

import java.time.LocalTime;
import java.util.Date;

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
		String userId = execution.getVariable("userId", String.class);
		String ruleName = execution.getVariable("ruleName", String.class);
		String createBy = execution.getVariable("createBy", String.class);
		Date createTime = execution.getVariable("createTime", Date.class);
		String rootIds = execution.getVariable("rootIds", String.class);
		String sourcePathName = execution.getVariable("sourcePathName", String.class);
		entity.setSourcePath(sourcePath);
		entity.setRuleName(ruleName);
		entity.setUserId(createBy);
		entity.setCreateBy(createBy);
		entity.setCreateTime(createTime);
		entity.setRootIds(rootIds);
		entity.setSourcePathName(sourcePathName);
		bean.save(entity);
		execution.setVariable("ruleId", entity.getRuleId());
	}

}
