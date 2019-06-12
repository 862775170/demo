//package com.example.demo.controller;
//
//import java.util.List;
//
//import javax.servlet.http.HttpServletResponse;
//
//import org.flowable.engine.HistoryService;
//import org.flowable.engine.history.HistoricProcessInstance;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.example.demo.common.Result;
//import com.example.demo.service.ProcessDiagram;
//
//@RestController
//@RequestMapping("process")
//public class ProcessController {
//	@Autowired
//	private ProcessDiagram processDiagram;
//	@Autowired
//	private HistoryService historyService;
//
//	@GetMapping
//	public Result getProcessId() {
//		List<HistoricProcessInstance> list = historyService.createHistoricProcessInstanceQuery().list();
//		return Result.ok(list);
//	}
//
//	@GetMapping(value = "processDiagram")
//	public void genProcessDiagram(HttpServletResponse httpServletResponse, String processId) throws Exception {
//		processDiagram.genProcessDiagram(httpServletResponse, processId);
//	}
//}
