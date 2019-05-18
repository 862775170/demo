package com.example.demo.common;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.beanutils.BeanMap;
import org.apache.commons.beanutils.BeanUtils;

public class ObjectUtils {

	public static <T> T mapToObject(Map<String, Object> map, Class<T> beanClass) throws Exception {
		if (map == null)
			return null;
		T obj = beanClass.newInstance();
		BeanUtils.populate(obj, map);
		return obj;
	}

	public static Map<Object, Object> objectToMap(Object obj) {
		if (obj == null)
			return null;
		return new HashMap<Object, Object>(new BeanMap(obj));
	}
}
