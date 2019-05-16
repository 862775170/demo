package com.example.demo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dao.FileTypeRepository;
import com.example.demo.service.FileTypeService;

@Service
public class FileTypeServiceImpl implements FileTypeService {

	@Autowired
	private FileTypeRepository fileTypeRepository;
}
