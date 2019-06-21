package com.example.demo.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.apache.commons.lang3.StringUtils;
//import org.flowable.engine.RuntimeService;
//import org.flowable.engine.TaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.PatternMatchUtils;

import com.example.demo.common.ConfirmSyncModel;
import com.example.demo.common.ObjectUtils;
import com.example.demo.common.ParamException;
import com.example.demo.common.TokenUtils;
import com.example.demo.config.MqProperties;
import com.example.demo.dao.FileExchangeLogDao;
import com.example.demo.dao.RuleConfirmDao;
import com.example.demo.dao.RuleDao;
import com.example.demo.entity.Rule;
import com.example.demo.entity.RuleConfirm;
import com.example.demo.entity.RuleFile;
import com.example.demo.entity.Trends;
import com.example.demo.message.FileCopyMessage;
import com.example.demo.model.FileInfo;
import com.example.demo.model.UserInfo;
import com.example.demo.service.FileSendHisService;
import com.example.demo.service.FileService;
import com.example.demo.service.RuleConfirmService;
import com.example.demo.service.RuleFileService;
import com.example.demo.service.RuleService;
import com.example.demo.service.TrendsService;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class RuleServiceImpl extends PatternMatchUtils implements RuleService {

	private static final Logger log = LoggerFactory.getLogger(RuleServiceImpl.class);
	@Autowired
	private ObjectMapper objectMapper;
//	@Autowired
//	private RuntimeService runtimeService;
//
//	@Autowired
//	private TaskService taskService;
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
	@Autowired
	private FileExchangeLogDao fileExchangeLogDao;
	@Autowired
	private FileSendHisService fileSendHisService;
	/**
	 * 热点
	 */
	@Autowired
	private TrendsService trendsService;
	@Autowired
	private RuleFileService ruleFileService;
	@Autowired
	private RuleConfirmService ruleConfirmService;

	@Override
	public void startCreateProcess(Rule rule, Set<String> userIds) {
		log.info("create from => {}", rule.toString(), userIds);
		rule.setUserId(rule.getCreateBy());
		rule.setSourcePathName(fileService.getFileFullPath(rule.getSourcePath(), rule.getRootIds()));
		rule = ruleDao.save(rule);
		String swapFolder = fileService.createRuleSwap(rule.getRuleId().toString());
		ruleDao.save(rule);
		rule.setSwapFolder(swapFolder);
		Integer ruleId = rule.getRuleId();
		String createBy = rule.getUserId();
		Date createTime = new Date();
		ruleConfirmService.addRuleConfirm(userIds, ruleId, rule.getRuleName(), createBy, createTime);
	}

	@Override
	public List<Map<String, Object>> getTasks(String assignee) {
		List<RuleConfirm> confirms = ruleConfirmDao.findByUserIdAndConfirmTimeIsNullAndDeleteTimeIsNull(assignee);
		Set<Integer> ruleIds = new HashSet<>();
		Set<String> userIds = new HashSet<>();
		confirms.forEach(a -> {
			if (a.getRuleId() != null)
				ruleIds.add(a.getRuleId());
			if (StringUtils.isNotEmpty(a.getCreateBy()))
				userIds.add(a.getCreateBy());
		});

		Map<String, String> userNames = userService.getUserNames(userIds);
		Map<Integer, String> ruleMap = getRuleMap(ruleIds);
		// List<Task> list =
		// taskService.createTaskQuery().taskAssignee(assignee).list();
		// List<Map<String, Object>> list2 = new ArrayList<>();
//		for (Task task : list) {
//			Map<String, Object> map = new HashMap<>();
//			map.put("id", task.getId());
//			map.put("name", task.getName());
//			map.put("processInstanceId", task.getProcessInstanceId());
////			map.put("processVariables", task.getProcessVariables());
////			map.put("taskLocalVariables", task.getTaskLocalVariables());
//			map.put("variables", taskService.getVariables(task.getId()));
//			list2.add(map);
//		}
		List<Map<String, Object>> list2 = confirms.stream().map(m -> {
			Map<String, Object> objectToMap = ObjectUtils.objectToMap(m);
			objectToMap.put("ruleName", ruleMap.get(m.getRuleId()));
			objectToMap.put("userName", userNames.get(m.getCreateBy()));
			objectToMap.put("taskId", m.getId());
			objectToMap.put("createByName", userNames.get(m.getCreateBy()));
			return objectToMap;
		}).collect(Collectors.toList());
		return list2;
	}

	@Override
	@Transactional
	public void confirmRuleProcess(String savePath, String saveFileId, String rootIds, Integer taskId,
			ConfirmSyncModel model) {
		RuleConfirm ruleConfirm = ruleConfirmDao.findById(taskId).get();
		ruleConfirm.setSaveFileId(saveFileId);
		ruleConfirm.setSavePath(savePath);
		ruleConfirm.setRootIds(rootIds);
		ruleConfirm.setSavePathName(fileService.getFileFullPath(savePath, rootIds));
		FileInfo fineInfo = fileService.getFineInfo(saveFileId);
		ruleConfirm.setConfirmBy(fineInfo.getUserId());
		ruleConfirm.setConfirmTime(new Date());
		ruleConfirm = ruleConfirmDao.save(ruleConfirm);
		Integer ruleId = ruleConfirm.getRuleId();
		String targetUserId = ruleConfirm.getUserId();
		Integer ruleConfirmId = ruleConfirm.getId();
		List<RuleFile> ruleFiles = new ArrayList<>();
		switch (model) {
		case all:
			ruleFiles = ruleFileService.getAllRuleFile(ruleId);
			break;
		case toDay:
			ruleFiles = ruleFileService.getToDayRuleFile(ruleId);
			break;
		case current:
		default:
			break;
		}
		log.info("userId -> {} comfirm model ->{} copy size ->{},ruleId->{}", targetUserId, model, ruleFiles.size(),
				ruleId);
		for (RuleFile ruleFile : ruleFiles) {
			Date sendTime = ruleFile.getUploadTime();
			String fullPathName = ruleFile.getSourceFullPath();
			String sourceFileName = ruleFile.getSourceFileName();
			String swapFileId = ruleFile.getFileId();
			String sourceUserId = ruleFile.getSourceUserId();
			sendFileCopyMessage(sendTime, fullPathName, sourceFileName, ruleId, sourceUserId, swapFileId, targetUserId,
					ruleConfirmId, saveFileId);
		}
	}

	@Override
	public List<Map<String, Object>> getRules(String userId) {
		List<Rule> findByUserId = ruleDao.findByUserIdAndDeleteTimeIsNull(userId);
		List<Map<String, Object>> collect = findByUserId.stream().map(r -> {
			Map<String, Object> objectToMap = ObjectUtils.objectToMap(r);
			return objectToMap;
		}).collect(Collectors.toList());
		return collect;
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
			hashMap.put("confirmTime", r.getConfirmTime());
//			hashMap.put("username", targetUser.getUsername());
			return hashMap;
		}).collect(Collectors.toList());
		return collect;
	}

	@Override
	public List<Map<String, Object>> getMyRuleConfirm(String userId) {
		List<RuleConfirm> findByUserId = ruleConfirmDao.findByUserId(userId);
		Set<Integer> ruleIds = new HashSet<>();
		Set<String> userIds = new HashSet<>();
		findByUserId.forEach(r -> {
			if (r.getRuleId() != null)
				ruleIds.add(r.getRuleId());
			if (StringUtils.isNotEmpty(r.getCreateBy()))
				userIds.add(r.getCreateBy());
		});
		Map<Integer, Rule> ruleMap = new HashMap<>();
		List<Rule> rules = ruleDao.findByRuleIdIn(ruleIds);
		rules.forEach(r -> {
			ruleMap.put(r.getRuleId(), r);
			userIds.add(r.getUserId());
		});
		Map<String, String> userNames = userService.getUserNames(userIds);
		List<Map<String, Object>> collect = findByUserId.stream().map(m -> {
			Integer ruleId = m.getRuleId();
			Rule one = ruleMap.get(ruleId);
			Map<String, Object> objectToMap = ObjectUtils.objectToMap(m);
			Map<String, Object> ruleMo = ObjectUtils.objectToMap(one);
			objectToMap.put("receiverUserName", userNames.get(one.getUserId()));
			objectToMap.put("sendUserName", userNames.get(m.getUserId()));
			objectToMap.put("rule", ruleMo);
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
	public List<Map<Object, Object>> getRuleRelation(String userId, String targetUserId) {
		List<Integer> rids = ruleDao.findByUserIdAndDeleteTimeIsNull(userId).stream().map(m -> m.getRuleId())
				.collect(Collectors.toList());
		List<Integer> targetRuleIds = ruleDao.findByUserIdAndDeleteTimeIsNull(targetUserId).stream()
				.map(m -> m.getRuleId()).collect(Collectors.toList());
		List<RuleConfirm> ruleConfirm = new ArrayList<>();
		ruleConfirm.addAll(ruleConfirmDao.findByRuleIdInAndUserId(rids, targetUserId));
		ruleConfirm.addAll(ruleConfirmDao.findByRuleIdInAndUserId(targetRuleIds, userId));
		Set<String> userIds = new HashSet<>();
		Set<Integer> ruleIds = new HashSet<>();
		userIds.add(userId);
		ruleConfirm.stream().forEach(a -> {
			if (a.getRuleId() != null)
				ruleIds.add(a.getRuleId());
			if (StringUtils.isNotEmpty(a.getCreateBy()))
				userIds.add(a.getCreateBy());
		});
		List<Rule> rules = ruleDao.findByDeleteTimeIsNullAndRuleIdIn(new ArrayList<>(ruleIds));
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
			if (userId.equals(m.getUserId())) {
				map.put("startTime", m.getCreateTime());
			} else {
				map.put("startTime", rule.getCreateTime());
			}

			return map;
		}).collect(Collectors.toList());
		return collect;
	}

	@Override
	public void deleteRule(String userId, Integer ruleId) {
		Rule rule = ruleDao.findById(ruleId).get();
		Date date = new Date();
		rule.setDeleteTime(date);
		ruleDao.save(rule);
		List<RuleConfirm> ruleConfirms = ruleConfirmDao.findByRuleId(ruleId);
		List<Trends> trendList = new ArrayList<>();
		for (RuleConfirm ruleConfirm : ruleConfirms) {
			ruleConfirm.setDeleteTime(date);
			Trends trends = new Trends();
			trends.setCreateTime(date);
			trends.setDesc(rule.getRuleName());
			trends.setEvent("删除规则");
			trends.setUserId(ruleConfirm.getUserId());
			trendList.add(trends);
		}
		if (!ruleConfirms.isEmpty()) {
			ruleConfirmDao.saveAll(ruleConfirms);
		}
		if (!trendList.isEmpty()) {
			trendsService.saveBatch(trendList);
		}

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
		log.info("update rule =>{}", rule);
		Rule ruleEntity = ruleDao.findById(rule.getRuleId()).get();
		if (StringUtils.isNotEmpty(rule.getSourcePath())) {
			ruleEntity.setSourcePath(rule.getSourcePath());
			ruleEntity.setSourcePathName(fileService.getFileFullPath(rule.getSourcePath(), ruleEntity.getRootIds()));
			ruleEntity.setSourceFileId(rule.getSourceFileId());
			ruleEntity.setDesc(rule.getDesc());
			ruleEntity.setRuleName(rule.getRuleName());
			ruleEntity.setFileName(rule.getFileName());
			ruleDao.saveAndFlush(ruleEntity);
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
		UserInfo userInfo = userService.getUserInfo(userId);

		String fullPath = fineInfo.getFullPath();
		String fullPathName = fileService.getFileFullPath(fullPath, userInfo.getRootIds());
		List<Rule> rules = ruleDao.findByUserIdAndDeleteTimeIsNull(userId);
		log.info("matching rule sum=> {},userId {}", rules.size(), userId);
//		String fileName = fineInfo.getFilename();
		String sourceFileName = fineInfo.getFilename();
		for (Rule rule : rules) {
			Integer ruleId = rule.getRuleId();
			String sourceUserId = rule.getUserId();
			String sourceFileId = rule.getSourceFileId();
//			FileInfo ruleFileInfo = fileService.getFineInfo(sourceFileId);
//			String sourcePath = ruleFileInfo.getFullPath();
			if (fullPath.indexOf(sourceFileId) == -1) {
				log.info("no matching ruleId=>{},fullPath=>{}", rule.getRuleId(), fullPath);
				continue;
			}
			String pattern = rule.getFileName();
			if (pattern == null) {
				pattern = "*";
			}
			if (!simpleMatch(pattern, sourceFileName)) {
				log.info("no matching pattern=>{},sourceFileName=>{}", pattern, sourceFileName);
				continue;
			}

			String swapFileId = fileService.copyToSwap(fileId, rule.getSwapFolder(), sourceFileName);
			ruleFileService.saveRuleFile(ruleId, fileId, sendTime, sourceFileId, fullPathName, sourceUserId,
					sourceFileName);

			List<RuleConfirm> ruleConfirms = ruleConfirmDao
					.findByRuleIdAndDeleteTimeIsNullAndConfirmTimeIsNotNull(ruleId);
			if (ruleConfirms.isEmpty()) {
				log.info("rule confirms is null ruleId=>{}", ruleId);
			}
			for (RuleConfirm ruleConfirm : ruleConfirms) {
				String targetUserId = ruleConfirm.getUserId();
				Integer ruleConfirmId = ruleConfirm.getId();
				String saveFolderId = ruleConfirm.getSaveFileId();

				sendFileCopyMessage(sendTime, fullPathName, sourceFileName, ruleId, sourceUserId, swapFileId,
						targetUserId, ruleConfirmId, saveFolderId);
			}
			fileSendHisService.addFileSendHis(userId, ruleId, ruleConfirms.size(), fileId, sourceFileName, sendTime);
		}
	}

	/**
	 * 发送Mq消息
	 * 
	 * @param sendTime       发送时间
	 * @param fullPathName   发送全路径
	 * @param sourceFileName 发送文件名
	 * @param ruleId         规则Id
	 * @param sourceUserId   发送人Id
	 * @param swapFileId     交换空间文件Id
	 * @param targetUserId   接收人id
	 * @param ruleConfirmId  确认Id
	 * @param saveFolderId   保存目录
	 */
	private void sendFileCopyMessage(Date sendTime, String fullPathName, String sourceFileName, Integer ruleId,
			String sourceUserId, String swapFileId, String targetUserId, Integer ruleConfirmId, String saveFolderId) {
		FileCopyMessage fileCopyMessage = new FileCopyMessage();
		// 确认规则Id
		fileCopyMessage.setRuleConfirmId(ruleConfirmId);
		// 规则Id
		fileCopyMessage.setRuleId(ruleId);
		// 交换空间的文件id
		fileCopyMessage.setSourceFileId(swapFileId);
		// 发送源文件全路径
		fileCopyMessage.setSourceFullPath(fullPathName);
		// 发送源文件名
		fileCopyMessage.setSourceFileName(sourceFileName);
		// 发送人
		fileCopyMessage.setSourceUserId(sourceUserId);
		// 保存目录
		fileCopyMessage.setTargerParentId(saveFolderId);
		// 保存用户Id
		fileCopyMessage.setTargetUserId(targetUserId);
		// 保存文件名
		fileCopyMessage.setTargetFileName(sourceFileName);
		// 文件上传时间
		fileCopyMessage.setSendTime(sendTime);
		String writeValueAsString;
		try {
			writeValueAsString = objectMapper.writeValueAsString(fileCopyMessage);
		} catch (JsonProcessingException e) {
			log.error(e.getMessage(), e);
			throw new RuntimeException(e);
		}
		rabbitTemplate.convertAndSend(mqQueueConfig.getExchange(), mqQueueConfig.getRoutingKey(), writeValueAsString);
	}

	@Override
	public Map<Integer, String> getRuleMap(Collection<Integer> ruleIds) {
		List<Rule> rules = ruleDao.findByRuleIdIn(ruleIds);
		Map<Integer, String> map = new HashMap<>();
		rules.forEach(r -> {
			map.put(r.getRuleId(), r.getRuleName());
		});
		return map;
	}

	@Override
	public Page<Map<String, Object>> getRuleCount(String userId, Pageable pageable) {
		Rule rule = new Rule();
		rule.setUserId(userId);

		Page<Rule> findAll = ruleDao.findAll(Example.of(rule), pageable);
		Page<Map<String, Object>> map = findAll.map(s -> {
			Map<String, Object> obj = ObjectUtils.objectToMap(s);
			obj.put("countSendFile", fileExchangeLogDao.countByRuleId(s.getRuleId()));
			obj.put("countSendUser", ruleConfirmDao.countByRuleId(s.getRuleId()));
			return obj;
		});
		return map;
	}

	@Override
	public Page<Map<String, Object>> getRuleReceiveCount(String userId, Pageable pageable) {
		RuleConfirm ruleConfirm = new RuleConfirm();
		ruleConfirm.setUserId(userId);
		Page<RuleConfirm> findAll = ruleConfirmDao.findAll(Example.of(ruleConfirm), pageable);
		Set<Integer> ruleIds = new HashSet<>();

		findAll.forEach(a -> {
			ruleIds.add(a.getRuleId());
		});
		Map<Integer, String> ruleMap = getRuleMap(ruleIds);
		Page<Map<String, Object>> results = findAll.map(m -> {
			Map<String, Object> map = new HashMap<>();
			map.putAll(ObjectUtils.objectToMap(m));
			map.put("ruleName", ruleMap.get(m.getRuleId()));
			map.put("count", fileExchangeLogDao.countByRuleId(m.getRuleId()));
			return map;
		});
		return results;
	}

	@Override
	public Long countByUserId(String userId) {
		return ruleDao.countByUserIdAndDeleteTimeIsNull(userId);
	}

	@Override
	public List<Map<String, Object>> getRuleReceiveCountByChart(String userId) {

		RuleConfirm ruleConfirm = new RuleConfirm();
		ruleConfirm.setUserId(userId);
		List<RuleConfirm> findAll = ruleConfirmDao.findAll(Example.of(ruleConfirm));
		Set<Integer> ruleIds = new HashSet<>();

		findAll.forEach(a -> {
			ruleIds.add(a.getRuleId());
		});
		Map<Integer, String> ruleMap = getRuleMap(ruleIds);
		List<Map<String, Object>> results = findAll.stream().map(m -> {
			Map<String, Object> map = new HashMap<>();
			map.put("x", ruleMap.get(m.getRuleId()));
			map.put("y", fileExchangeLogDao.countByRuleId(m.getRuleId()));
			return map;
		}).collect(Collectors.toList());
		return results;
	}

	@Override
	public List<Map<String, Object>> getRuleCountByChart(String userId) {
		Rule rule = new Rule();
		rule.setUserId(userId);

		List<Rule> findAll = ruleDao.findAll(Example.of(rule));
		List<Map<String, Object>> map = findAll.stream().map(s -> {
			Map<String, Object> obj = new HashMap<>();
			obj.putAll(ObjectUtils.objectToMap(s));
			obj.put("ruleName", s.getRuleName());
			obj.put("countSendFile", fileExchangeLogDao.countByRuleId(s.getRuleId()));
			obj.put("countSendUser", ruleConfirmDao.countByRuleId(s.getRuleId()));
			return obj;
		}).collect(Collectors.toList());
		return map;
	}

	@Override
	public Page<Map<String, Object>> getRuleOutCount(String userId, String targetUserId, Pageable pageable) {
		List<RuleConfirm> ruleConfirmList = ruleConfirmDao
				.findByUserIdAndConfirmTimeIsNullAndDeleteTimeIsNull(targetUserId);
		List<Integer> ruleIds = ruleConfirmList.stream().map(RuleConfirm::getRuleId).collect(Collectors.toList());
		Page<Rule> page = ruleDao.findByRuleIdInAndUserId(ruleIds, userId, pageable);
		Page<Map<String, Object>> map = page.map(r -> {
			Map<String, Object> objectToMap = ObjectUtils.objectToMap(r);
			Long count = fileExchangeLogDao.countByRuleIdAndTargetUserId(r.getRuleId(), targetUserId);
			objectToMap.put("count", count);
			return objectToMap;
		});
		return map;
	}

	@Override
	public void deleteRuleConfirmByUserIdAndRuleId(String userId, Integer ruleId) {
		Date date = new Date();
		RuleConfirm ruleConfirm = ruleConfirmDao.findByRuleIdAndUserId(ruleId, userId);
		ruleConfirm.setDeleteTime(date);
		ruleConfirm.setDeleteBy(TokenUtils.getUserId());
		RuleConfirm saveAndFlush = ruleConfirmDao.saveAndFlush(ruleConfirm);
		log.debug("update success {}", saveAndFlush);
	}
}
