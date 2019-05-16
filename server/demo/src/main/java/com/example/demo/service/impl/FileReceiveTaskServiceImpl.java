package com.example.demo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dao.FileReceiveTaskRepository;
import com.example.demo.service.FileReceiveTaskService;

@Service
public class FileReceiveTaskServiceImpl implements FileReceiveTaskService {

	@Autowired
	private FileReceiveTaskRepository fileReceiveTaskRepository;
}
