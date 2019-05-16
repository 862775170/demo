package com.example.demo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dao.FileReceiveHisRepository;
import com.example.demo.service.FileReceiveHisService;

@Service
public class FileReceiveHisServiceImpl implements FileReceiveHisService {

	@Autowired
	private FileReceiveHisRepository fileReceiveHisRepository;
}
