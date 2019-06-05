package com.example.demo.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.demo.entity.Trends;

public interface TrendsService {

	void saveBatch(List<Trends> trendList);

	Page<Trends> getTrendsPage(String userId, Pageable pageable);

}
