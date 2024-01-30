package com.jan.diagramcanvas;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.io.IOException;

@SpringBootApplication
public class DiagramCanvasApplication {
	@Value("${spring.data.redis.host}")
	private String host;
	@Value("${spring.data.redis.port}")
	private int port;
	@Value("${spring.data.redis.password}")
	private String password;

	public static void main(String[] args) {
		SpringApplication.run(DiagramCanvasApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("http://localhost:3000")
						.allowedMethods("*")
						.allowedHeaders("Authorization", "Content-Type", "Test")
						.allowCredentials(true);
			}
		};
	}

	@Bean
	public Filter testFilterConfig() {
		return new Filter() {
			@Override
			public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
				HttpServletRequest req = (HttpServletRequest) request;
				HttpServletResponse res = (HttpServletResponse) response;

				String requestURI = req.getRequestURI();
				String testHeader = req.getHeader("test");
				String method = req.getMethod();

				if (HttpMethod.OPTIONS.matches(method) || "3030".equals(testHeader)) {
//				if ("3030".equals(testHeader)) {
					System.out.println(req.getHeader("origin"));
					System.out.println("method : " + method);
					System.out.println(requestURI);
					System.out.println(testHeader);
					System.out.println();

					chain.doFilter(request, response);

					res.setHeader("Access-Control-Allow-Origin", req.getHeader("origin"));
					res.setHeader("Access-Control-Allow-Methods", "*");
					res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Test");
					res.setHeader("Access-Control-Max-Age", "3600");

				}
			}
		};
	}

	@Bean
	public RedisConnectionFactory redisConnectionFactory() {
		RedisStandaloneConfiguration redisStandaloneConfiguration =
				new RedisStandaloneConfiguration(host, port);
		redisStandaloneConfiguration.setPassword(password);
		return new LettuceConnectionFactory(redisStandaloneConfiguration);
	}

	@Bean
	public RedisTemplate<String, Object> redisTemplate() {
		RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
		redisTemplate.setConnectionFactory(redisConnectionFactory());

		//일반적인 key:value의 경우 시리얼라이저
//		redisTemplate.setKeySerializer(new StringRedisSerializer());
//		redisTemplate.setValueSerializer(new StringRedisSerializer());

		// Hash를 사용할 경우 시리얼라이저
//		redisTemplate.setHashKeySerializer(new StringRedisSerializer());
//		redisTemplate.setHashValueSerializer(new StringRedisSerializer());

		//모든 경우
		redisTemplate.setDefaultSerializer(new StringRedisSerializer());

		return redisTemplate;
	}
}
