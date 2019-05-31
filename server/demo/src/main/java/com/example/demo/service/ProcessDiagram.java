package com.example.demo.service;

import javax.servlet.http.HttpServletResponse;

public interface ProcessDiagram {

	/**
	 * 判断流程是否完成
	 * 
	 * @param processInstanceId
	 * @return
	 */
	boolean isFinished(String processInstanceId);

	/**
	 * 获得流程图
	 * 
	 * @param httpServletResponse
	 * @param processId
	 */
	void genProcessDiagram(HttpServletResponse httpServletResponse, String processId);

}
