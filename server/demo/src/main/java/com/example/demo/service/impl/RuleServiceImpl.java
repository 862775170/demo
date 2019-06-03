package com.example.demo.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.utils.DateUtils;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.task.api.Task;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.common.ObjectUtils;
import com.example.demo.common.ParamException;
import com.example.demo.common.UUIDUtils;
import com.example.demo.config.MqProperties;
import com.example.demo.dao.RuleConfirmDao;
import com.example.demo.dao.RuleDao;
import com.example.demo.entity.Rule;
import com.example.demo.entity.RuleConfirm;
import com.example.demo.message.FileCopyMessage;
import com.example.demo.model.FileInfo;
import com.example.demo.model.UserInfo;
import com.example.demo.service.FileService;
import com.example.demo.service.RuleService;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class RuleServiceImpl implements RuleService {

	private static final Logger log = LoggerFactory.getLogger(RuleServiceImpl.class);
	@Autowired
	private ObjectMapper objectMapper;
	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private TaskService taskService;
	@Autowired
	private RuleDao ruleDao;
	@Autowired
	private RuleConfirmDao ruleConfirmDao;

	@Autowired
	private FileService fileService;
	@Autowired
	private UserService userService;
	@Autowired
	private RabbitTemplate rabbitTemplate;
	@Autowired
	private MqProperties mqQueueConfig;

	@Override
	public void startCreateProcess(Rule rule, String[] userIds) {
		log.info("create from => {}", rule.toString(), Arrays.toString(userIds));
		Map<String, Object> variables = new HashMap<>();
		variables.put("userIds", userIds);
		variables.put("createBy", rule.getCreateBy());
		variables.put("ruleName", rule.getRuleName());
		variables.put("userId", rule.getUserId());
		variables.put("sourcePath", rule.getSourcePath());
		variables.put("sourceFileId", rule.getSourceFileId());
		variables.put("rootIds", rule.getRootIds());
		variables.put("createTime", rule.getCreateTime());
		variables.put("sourcePathName", fileService.getFileFullPath(rule.getSourcePath(), rule.getRootIds()));
		runtimeService.startProcessInstanceByKey("CreateRuleProcess", variables);
	}

	@Override
	public List<Map<String, Object>> getTasks(String assignee) {
		List<Task> list = taskService.createTaskQuery().taskAssignee(assignee).list();
		List<Map<String, Object>> list2 = new ArrayList<>();
		for (Task task : list) {
			Map<String, Object> map = new HashMap<>();
			map.put("id", task.getId());
			map.put("name", task.getName());
			map.put("processInstanceId", task.getProcessInstanceId());
//			map.put("processVariables", task.getProcessVariables());
//			map.put("taskLocalVariables", task.getTaskLocalVariables());
			map.put("variables", taskService.getVariables(task.getId()));
			list2.add(map);
		}
		return list2;
	}

	@Override
	public void confirmRuleProcess(String savePath, String saveFileId, String rootIds, String taskId) {
		Map<String, Object> variables = new HashMap<>();
		variables.put("savePath", savePath);
		variables.put("rootIds", rootIds);
		variables.put("saveFileId", saveFileId);
		variables.put("savePathName", fileService.getFileFullPath(savePath, rootIds));
		taskService.complete(taskId, variables);
	}

	@Override
	public List<Rule> getRules(String userId) {
		List<Rule> findByUserId = ruleDao.findByUserIdAndDeleteTimeIsNull(userId);
		return findByUserId;
	}

	@Override
	public List<Map<String, Object>> getFriends(String userId) {
		List<String> sendInUserId = getSendInUserId(userId);
		List<String> sendOutUserId = getSendOutUserId(userId);
		Set<String> hashSet = new HashSet<>();
		hashSet.addAll(sendOutUserId);
		hashSet.addAll(sendInUserId);
		Map<String, String> userNames = userService.getUserNames(new ArrayList<>(hashSet));
		List<Map<String, Object>> collect = hashSet.stream().map(id -> {
			Map<String, Object> map = new HashMap<>();
			map.put("userId", id);
			map.put("userName", userNames.get(id));
			return map;
		}).collect(Collectors.toList());
		return collect;
	}

	@Override
	public List<Map<String, Object>> getFriendsDetails(Integer ruleId) {
		List<RuleConfirm> ruleTargets = ruleConfirmDao.findByRuleIdAndDeleteTimeIsNull(ruleId);
		List<String> userIds = ruleTargets.stream().map(RuleConfirm::getUserId).collect(Collectors.toList());
		Map<String, String> userNames = userService.getUserNames(userIds);
		List<Map<String, Object>> collect = ruleTargets.stream().map(r -> {
			Map<String, Object> hashMap = new HashMap<>();
//			User targetUser = userDao.findById(r.getUserId()).get();
			hashMap.put("id", r.getId());
			hashMap.put("userId", r.getUserId());
			hashMap.put("userName", userNames.get(r.getUserId()));
//			hashMap.put("username", targetUser.getUsername());
			return hashMap;
		}).collect(Collectors.toList());
		return collect;
	}

	@Override
	public List<Map<String, Object>> getMyRuleConfirm(String userId) {
		List<RuleConfirm> findByUserId = ruleConfirmDao.findByUserId(userId);
		List<Map<String, Object>> collect = findByUserId.stream().map(m -> {
			Integer ruleId = m.getRuleId();
			Rule one = ruleDao.findByRuleId(ruleId);
			Map<String, Object> objectToMap = ObjectUtils.objectToMap(m);
			objectToMap.put("rule", ObjectUtils.objectToMap(one));
			return objectToMap;
		}).collect(Collectors.toList());
		return collect;
//		List<Map<String, Object>> collect = ruleTargets.stream().map(m -> {
//			Map<String, Object> obj = new HashMap<>();
//			obj.put("savePath", m.getSavePath());
//			obj.put("createTime", m.getCreateTime());
//			obj.put("ruleId", m.getRuleId());
//			return obj;
//		}).collect(Collectors.toList());
//		return collect;
	}

	@Override
	public List<Map<Object, Object>> getRuleRelation(String userId) {
		List<Integer> rids = ruleDao.findByUserId(userId).stream().map(m -> m.getRuleId()).collect(Collectors.toList());
		List<RuleConfirm> ruleConfirm = ruleConfirmDao.findByUserId(userId);
		ruleConfirm.addAll(ruleConfirmDao.findByRuleIdIn(rids));
		Set<String> userIds = new HashSet<>();
		Set<Integer> ruleIds = new HashSet<>();
		userIds.add(userId);
		ruleConfirm.stream().forEach(a -> {
			userIds.add(a.getUserId());
			ruleIds.add(a.getRuleId());
		});
		List<Rule> rules = ruleDao.findByRuleIdIn(new ArrayList<>(ruleIds));
		Map<Integer, Rule> ruleMap = new HashMap<>();
		rules.stream().forEach(a -> {
			userIds.add(a.getUserId());
			ruleMap.put(a.getRuleId(), a);
		});
		Map<String, String> userNames = userService.getUserNames(new ArrayList<>(userIds));

		List<Map<Object, Object>> collect = ruleConfirm.stream().map(m -> {
			Rule rule = ruleMap.get(m.getRuleId());
			Map<Object, Object> map = new HashMap<>();
			map.put("id", m.getId());
			map.put("sendUserName", userNames.get(rule.getUserId()));
			map.put("receiveUserName", userNames.get(m.getUserId()));
			map.put("ruleName", rule.getRuleName());
			map.put("deleteTime", rule.getDeleteTime());
			return map;
		}).collect(Collectors.toList());
		return collect;
	}

	@Override
	public void deleteRule(String userId, Integer ruleId) {
		Rule rule = ruleDao.findById(ruleId).get();
		rule.setDeleteTime(new Date());
		ruleDao.save(rule);
	}

	@Override
	public void deleteRuleConfirm(String userId, List<Integer> ids) {
		List<RuleConfirm> entities = new ArrayList<>();
		log.info("delete ruleConfirm ids=>{}", ids);
		for (Integer id : ids) {
			RuleConfirm ruleConfirm = ruleConfirmDao.findById(id).get();
			ruleConfirm.setDeleteTime(new Date());
			entities.add(ruleConfirm);
		}
		ruleConfirmDao.saveAll(entities);

	}

	@Override
	public void updateRule(Rule rule) {
		Rule ruleEntity = ruleDao.findById(rule.getRuleId()).get();
		if (StringUtils.isNotEmpty(rule.getSourcePath())) {
			if (rule.getSourcePath().equals(ruleEntity.getSourcePath())) {
				return;
			}
			ruleEntity.setSourcePath(rule.getSourcePath());
			ruleEntity.setSourcePathName(fileService.getFileFullPath(rule.getSourcePath(), ruleEntity.getRootIds()));
			ruleDao.save(ruleEntity);
		} else {
			throw new ParamException("400", "请选择路径");
		}
	}

	@Override
	public void updateRuleConfirm(RuleConfirm confirm) {
		RuleConfirm ruleConfirmEntity = ruleConfirmDao.findById(confirm.getId()).get();
		if (StringUtils.isNotEmpty(confirm.getSavePath())) {
			if (confirm.getSavePath().equals(ruleConfirmEntity.getSavePath())) {
				return;
			}
			ruleConfirmEntity.setSavePath(confirm.getSavePath());
			ruleConfirmEntity.setSavePathName(
					fileService.getFileFullPath(confirm.getSavePath(), ruleConfirmEntity.getRootIds()));
			ruleConfirmDao.save(ruleConfirmEntity);
		} else {
			throw new ParamException("400", "请选择路径");
		}
	}

	@Override
	public List<String> getSendInUserId(String userId) {
		List<RuleConfirm> ruleConfirms = ruleConfirmDao.findByUserId(userId);
		List<Integer> ruleIds = ruleConfirms.stream().map(RuleConfirm::getRuleId).collect(Collectors.toList());
		return ruleDao.findByRuleIdIn(ruleIds).stream().map(Rule::getUserId).collect(Collectors.toList());
	}

	@Override
	public List<String> getSendOutUserId(String userId) {
		List<Rule> rules = ruleDao.findByUserId(userId);
		List<RuleConfirm> ruleConfirm = ruleConfirmDao
				.findByRuleIdIn(rules.stream().map(s -> s.getRuleId()).collect(Collectors.toList()));
		return ruleConfirm.stream().map(RuleConfirm::getUserId).collect(Collectors.toList());
	}

	@Override
	public void matchingRule(String fileId, String userId, Date sendTime) {
		FileInfo fineInfo = fileService.getFineInfo(fileId);
		String fullPath = fineInfo.getFullPath();
		UserInfo userInfo = userService.getUserInfo(userId);
		String fullPathName = fileService.getFileFullPath(fullPath, userInfo.getRootIds());
		List<Rule> rules = ruleDao.findByUserIdAndDeleteTimeIsNull(userId);
		log.info("matching rule sum=> {}", rules.size());
		String fileName = fineInfo.getFilename();
		String sourceFileName = fileName;
		for (Rule rule : rules) {
			Integer ruleId = rule.getRuleId();
			String sourceUserId = rule.getUserId();
			String sourceFileId = rule.getSourceFileId();
//			FileInfo ruleFileInfo = fileService.getFineInfo(sourceFileId);
//			String sourcePath = ruleFileInfo.getFullPath();
			if (fullPath.indexOf(sourceFileId) != -1) {
				List<RuleConfirm> ruleConfirms = ruleConfirmDao.findByRuleIdAndDeleteTimeIsNull(ruleId);
				if (ruleConfirms.isEmpty()) {
					log.info("rule confirms is null ruleId=>{}", ruleId);
				}
				for (RuleConfirm ruleConfirm : ruleConfirms) {

					FileCopyMessage fileCopyMessage = new FileCopyMessage();
					fileCopyMessage.setRuleConfirmId(ruleConfirm.getId());
					fileCopyMessage.setRuleId(ruleId);
					fileCopyMessage.setSourceFileId(fileId);
					fileCopyMessage.setSourceFullPath(fullPathName);
					fileCopyMessage.setSourceFileName(sourceFileName);
					fileCopyMessage.setSourceUserId(sourceUserId);

					String targetUserId = ruleConfirm.getUserId();
					fileCopyMessage.setTargerParentId(ruleConfirm.getSaveFileId());
					fileCopyMessage.setTargetUserId(targetUserId);
					fileCopyMessage.setTargetFileName(fileName);
					fileCopyMessage.setSendTime(sendTime);
					String writeValueAsString;
					try {
						writeValueAsString = objectMapper.writeValueAsString(fileCopyMessage);
					} catch (JsonProcessingException e) {
						log.error(e.getMessage(), e);
						continue;
					}
					rabbitTemplate.convertAndSend(mqQueueConfig.getExchange(), mqQueueConfig.getRoutingKey(),
							writeValueAsString);
				}
			} else {
				log.info("no matching ruleId=>{},fullPath=>{}", rule.getRuleId(), fullPath);
			}
		}
	}

	private String getNewFileId(String oldFileId) {
		String suffix = "";
		if (oldFileId.lastIndexOf(".") != -1) {
			suffix = oldFileId.substring(oldFileId.lastIndexOf("."));
		}
		StringBuffer sb = new StringBuffer(DateUtils.formatDate(new Date(), "yyyyMMddHHmmss"));
		sb.append("_").append(UUIDUtils.generateHexStr()).append("_").append("lv0").append(suffix);
		return sb.toString();
	}

	@Override
	public Map<Integer, String> getRuleMap(List<Integer> ruleIds) {
		List<Rule> rules = ruleDao.findByRuleIdIn(ruleIds);
		Map<Integer, String> map = new HashMap<>();
		rules.forEach(r -> {
			map.put(r.getRuleId(), r.getRuleName());
		});
		return map;
	}

}
