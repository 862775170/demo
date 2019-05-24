package com.example.demo.service.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.demo.common.HttpClient;
import com.example.demo.service.FileService;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

@Service
public class FileServiceImpl implements FileService {

	private static final Logger log = LoggerFactory.getLogger(FileServiceImpl.class);

	@Autowired
	private HttpClient httpClient;

	@Override
	public String getFileFullPath(String fullPath, String rootIds) {
		// TODO 需要判断 full rootids 为空
		fullPath = fullPath.substring(fullPath.indexOf(rootIds), fullPath.length());
		String[] fileIds = fullPath.split("/");
		Map<String, Object> map = new HashMap<>();
		map.put("fileIds", Stream.of(fileIds).filter(r -> StringUtils.isNotEmpty(r)).collect(Collectors.toList()));
		ResponseEntity<JsonObject> postByJson = httpClient.postByJson("/file/multiGetFileInfo", map, JsonObject.class);
		log.info("http: /file/multiGetFileInfo result {}", postByJson);
		StringBuffer sb = new StringBuffer();
		Map<String, String> result = new HashMap<>();
		if (postByJson.getBody().has("result")) {
			JsonArray jsonArray = postByJson.getBody().get("result").getAsJsonArray();
			jsonArray.forEach(jobj -> {
				JsonObject el = jobj.getAsJsonObject();
				if (el.has("filename_KeywordIkPinyin")) {
					String fileId = el.get("file_id").getAsString();
					String fileIdPinyin = el.get("filename_KeywordIkPinyin").getAsString();
					result.put(fileId, fileIdPinyin);
				}
			});

			for (String id : fileIds) {
				if (id.equals(rootIds) || StringUtils.isEmpty(result.get(id))) {
					continue;
				}
				sb.append("/" + result.get(id));
			}
			return sb.toString();
		}

		return null;
	}

	@Override
	public String getFineInfo(String fileId) {
		// TODO Auto-generated method stub
		return null;
	}
}
