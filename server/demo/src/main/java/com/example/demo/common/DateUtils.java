package com.example.demo.common;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;

public class DateUtils {
	// 获得某天最大时间 2017-10-15 23:59:59
	public static Date getEndOfDay(Date date) {
		LocalDateTime localDateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(date.getTime()),
				ZoneId.systemDefault());
		LocalDateTime endOfDay = localDateTime.with(LocalTime.MAX);
		return Date.from(endOfDay.atZone(ZoneId.systemDefault()).toInstant());
	}

	// 获得某天最小时间 2017-10-15 00:00:00
	public static Date getStartOfDay(Date date) {
		LocalDateTime localDateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(date.getTime()),
				ZoneId.systemDefault());
		LocalDateTime startOfDay = localDateTime.with(LocalTime.MIN);
		return Date.from(startOfDay.atZone(ZoneId.systemDefault()).toInstant());
	}
}
