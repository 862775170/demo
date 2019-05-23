package com.example.demo.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.common.ParamException;
import com.example.demo.common.Result;
import com.example.demo.common.TokenUtils;
import com.example.demo.entity.Rule;
import com.example.demo.entity.RuleConfirm;
import com.example.demo.service.RuleService;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/rule")
public class RuleController {
	@Autowired
	private RuleService ruleService;

	@PostMapping()
	@ApiOperation("创建规则")
	public Result createRule(@RequestBody Rule rule, String[] userIds) {
		rule.setCreateTime(new Date());
		ruleService.startCreateProcess(rule, userIds);
		return Result.ok();
	}

	@PostMapping("/update")
	@ApiOperation("修改发送规则")
	public Result updateRule(@RequestBody Rule rule) {
		if (rule.getRuleId() == null) {
			throw new ParamException("400", "rule 为空");
		}
		ruleService.updateRule(rule);
		return Result.ok();
	}

	@PostMapping("ruleConfirm/update")
	@ApiOperation("修改确认规则")
	public Result updateRuleConfirm(@RequestBody RuleConfirm confirm) {
		if (confirm.getId() == null) {
			throw new ParamException("400", "[id] 为空");
		}
		ruleService.updateRuleConfirm(confirm);
		return Result.ok();
	}

	@PostMapping("/delete")
	@ApiOperation("删除规则")
	public Result deleteRule(String userId, Integer ruleId) {
		ruleService.deleteRule(userId, ruleId);
		return Result.ok();
	}

	@PostMapping("/ruleConfirm/delete")
	@ApiOperation("删除文件接收人")
	public Result deleteRuleConfirm(String userId, @RequestBody Integer[] ids) {
		ruleService.deleteRuleConfirm(userId, Arrays.asList(ids));
		return Result.ok();
	}

	@PostMapping("/confirmRule")
	@ApiOperation("接收人却认规则")
	public Result confirmRule(String savePath, String rootIds, String taskId) {
		ruleService.confirmRuleProcess(savePath, rootIds, taskId);
		return Result.ok();
	}

	@GetMapping("/tasks")
	@ApiOperation("获得待确认规则列表")
	public Result getTasks(String userId) {
		List<Map<String, Object>> tasks = ruleService.getTasks(userId);
		return Result.ok(tasks);
	}

	@GetMapping("/myRule")
	@ApiOperation("获得我发起规则")
	public Result getMyRule(String userId) {

		List<Rule> rules = ruleService.getRules(userId);
		return Result.ok(rules);
	}

	@GetMapping("/my/confirm/rule")
	@ApiOperation("获得确认的规则")
	public Result getMyRuleConfirm(String userId) {
//		Integer userId = TokenUtils.getUserId();
		List<Map<Object, Object>> rules = ruleService.getMyRuleConfirm(userId);
		return Result.ok(rules);
	}

	@GetMapping("/getFriends")
	@ApiOperation("获得我的好友")
	public Result getFriends(String userId) {
		List<Map<String, Object>> friends = ruleService.getFriends(userId);
		return Result.ok(friends);
	}

	/**
	 * @param userId
	 * @return
	 */
	@GetMapping("rule/relation")
	@ApiOperation("获得与我相关的规则")
	public Result getRuleRelation(String userId) {
		List<Map<Object, Object>> rules = ruleService.getRuleRelation(userId);

		return Result.ok(rules);
	}

	@GetMapping("/getRule/details")
	@ApiOperation("获得规则下面有多少人")
	public Result getRuleDetails(Integer ruleId) {
		List<Map<String, Object>> friends = ruleService.getFriendsDetails(ruleId);
		return Result.ok(friends);
	}
}
