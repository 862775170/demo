package com.example.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Trends;

public interface TrendsDao extends JpaRepository<Trends, Integer> {

}
