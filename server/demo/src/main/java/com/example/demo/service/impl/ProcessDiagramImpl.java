package com.example.demo.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.flowable.bpmn.model.BpmnModel;
import org.flowable.engine.HistoryService;
import org.flowable.engine.ProcessEngine;
import org.flowable.engine.ProcessEngineConfiguration;
import org.flowable.engine.RepositoryService;
import org.flowable.engine.RuntimeService;
import org.flowable.engine.history.HistoricActivityInstance;
import org.flowable.engine.history.HistoricProcessInstance;
import org.flowable.engine.runtime.ProcessInstance;
import org.flowable.image.ProcessDiagramGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.service.ProcessDiagram;

@Service
public class ProcessDiagramImpl implements ProcessDiagram {

	private static final Logger log = LoggerFactory.getLogger(ProcessDiagramImpl.class);

	@Autowired
	private ProcessEngine processEngine;

	@Autowired
	private RuntimeService runtimeService;

	@Autowired
	private HistoryService historyService;

	@Autowired
	private RepositoryService repositoryService;

	@Override
	public boolean isFinished(String processInstanceId) {
		return historyService.createHistoricProcessInstanceQuery().finished().processInstanceId(processInstanceId)
				.count() > 0;
	}

	@Override
	public void genProcessDiagram(HttpServletResponse httpServletResponse, String processId) {

		/**
		 * 获得当前活动的节点
		 */
		String processDefinitionId = "";
		if (this.isFinished(processId)) {// 如果流程已经结束，则得到结束节点
			HistoricProcessInstance pi = historyService.createHistoricProcessInstanceQuery()
					.processInstanceId(processId).singleResult();

			processDefinitionId = pi.getProcessDefinitionId();
		} else {// 如果流程没有结束，则取当前活动节点
			// 根据流程实例ID获得当前处于活动状态的ActivityId合集
			ProcessInstance pi = runtimeService.createProcessInstanceQuery().processInstanceId(processId)
					.singleResult();
			processDefinitionId = pi.getProcessDefinitionId();
		}
		List<String> highLightedActivitis = new ArrayList<String>();

		/**
		 * 获得活动的节点
		 */
		List<HistoricActivityInstance> highLightedActivitList = historyService.createHistoricActivityInstanceQuery()
				.processInstanceId(processId).orderByHistoricActivityInstanceStartTime().asc().list();

		for (HistoricActivityInstance tempActivity : highLightedActivitList) {
			String activityId = tempActivity.getActivityId();
			highLightedActivitis.add(activityId);
		}

		List<String> flows = new ArrayList<>();
		// 获取流程图
		BpmnModel bpmnModel = repositoryService.getBpmnModel(processDefinitionId);
		ProcessEngineConfiguration engconf = processEngine.getProcessEngineConfiguration();

		ProcessDiagramGenerator diagramGenerator = engconf.getProcessDiagramGenerator();
		log.debug("{},{},{}", engconf.getActivityFontName(), engconf.getLabelFontName(),
				engconf.getAnnotationFontName());
		InputStream in = diagramGenerator.generateDiagram(bpmnModel, "bmp", highLightedActivitis, flows,
				engconf.getActivityFontName(), engconf.getLabelFontName(), engconf.getAnnotationFontName(),
				engconf.getClassLoader(), 1.0, true);
		OutputStream out = null;
		byte[] buf = new byte[1024];
		int legth = 0;
		try {
			out = httpServletResponse.getOutputStream();
			while ((legth = in.read(buf)) != -1) {
				out.write(buf, 0, legth);
			}
		} catch (IOException e) {
			log.error("操作异常", e);
		} finally {
			IOUtils.closeQuietly(out);
			IOUtils.closeQuietly(in);
		}
	}
}
