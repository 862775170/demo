//package com.example.demo.delegate;
//
//import java.util.HashMap;
//import java.util.Map;
//
//import org.flowable.engine.RuntimeService;
//import org.flowable.engine.delegate.DelegateExecution;
//import org.flowable.engine.delegate.JavaDelegate;
//
//import com.example.demo.common.SpringUtils;
//
//public class StartConfirmRuleProcessDelegate implements JavaDelegate {
//
//	@Override
//	public void execute(DelegateExecution execution) {
//		String[] userIds = execution.getVariable("userIds", String[].class);
//		RuntimeService bean = SpringUtils.getBean(RuntimeService.class);
//		Map<String, Object> variabless = execution.getVariables();
//		for (String userId : userIds) {
//			Map<String, Object> variables = new HashMap<>(variabless);
//			variables.put("userId", userId);
//			bean.startProcessInstanceByKey("ConfirmRuleProcess", variables);
//		}
//
//	}
//}
