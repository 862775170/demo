package com.example.demo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.dao.TrendsDao;
import com.example.demo.entity.Trends;
import com.example.demo.service.TrendsService;

@Service
public class TrendsServiceImpl implements TrendsService {
	@Autowired
	private TrendsDao trendsDao;

	@Override
	public void saveBatch(List<Trends> trendList) {
		trendsDao.saveAll(trendList);
	}

	@Override
	public Page<Trends> getTrendsPage(String userId, Pageable pageable) {
		Trends trends = new Trends();
		trends.setUserId(userId);
		return trendsDao.findAll(Example.of(trends), pageable);
	}

}
