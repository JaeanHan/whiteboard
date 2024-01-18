package com.jan.diagramcanvas.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jan.diagramcanvas.models.SvgInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SaveService {
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    public Long saveTest(String owner, List<SvgInfo> list) throws Exception {
        HashOperations<String, Object, Object> hash = redisTemplate.opsForHash();

        for (SvgInfo svgInfo : list) {
            String id = svgInfo.getId();
            String attachment = objectMapper.writeValueAsString(svgInfo.getAttachment());
            hash.put(owner, id, attachment);
        }

        return hash.size(owner);
    }

    public Map<Object, Object> readTest(String owner) {
        return redisTemplate.opsForHash().entries(owner);
    }

}
