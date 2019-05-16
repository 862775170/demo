package com.example.demo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dao.FileReceiveRepository;
import com.example.demo.service.FileReceiveService;

@Service
public class FileReceiveServiceImpl implements FileReceiveService {

	@Autowired
	private FileReceiveRepository fileReceiveRepository;
}
