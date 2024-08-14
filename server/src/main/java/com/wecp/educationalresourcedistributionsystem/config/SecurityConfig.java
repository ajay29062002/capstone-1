package com.wecp.educationalresourcedistributionsystem.config;

import com.wecp.educationalresourcedistributionsystem.jwt.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

        private final UserDetailsService userDetailsService;
        private final JwtRequestFilter jwtRequestFilter;
        private final PasswordEncoder passwordEncoder;

        @Autowired
        public SecurityConfig(UserDetailsService userDetailsService,
                        JwtRequestFilter jwtRequestFilter,
                        PasswordEncoder passwordEncoder) {
                this.userDetailsService = userDetailsService;
                this.jwtRequestFilter = jwtRequestFilter;
                this.passwordEncoder = passwordEncoder;
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http.cors().and().csrf().disable()
                                .authorizeHttpRequests(authz -> authz
                                                .antMatchers("/api/user/register", "/api/user/login", "/api/user/users")
                                                .permitAll()
                                                .antMatchers(HttpMethod.POST, "/api/institution/event")
                                                .hasAnyAuthority("INSTITUTION")
                                                .antMatchers(HttpMethod.GET, "/api/institution/events")
                                                .hasAnyAuthority("INSTITUTION")
                                                .antMatchers(HttpMethod.POST, "/api/institution/resource")
                                                .hasAnyAuthority("INSTITUTION")
                                                .antMatchers(HttpMethod.GET, "/api/institution/resources")
                                                .hasAnyAuthority("INSTITUTION")
                                                .antMatchers(HttpMethod.POST, "/api/institution/event")
                                                .hasAnyAuthority("INSTITUTION")
                                                .antMatchers(HttpMethod.POST,
                                                                "/api/institution/event/allocate-resources")
                                                .hasAnyAuthority("INSTITUTION")
                                                .antMatchers(HttpMethod.DELETE, "/api/institution/events/{eventId}")
                                                .hasAnyAuthority("INSTITUTION")
                                                .antMatchers(HttpMethod.GET, "/api/educator/agenda")
                                                .hasAnyAuthority("EDUCATOR")
                                                .antMatchers(HttpMethod.PUT,
                                                                "/api/educator/update-material/{eventId}")
                                                .hasAnyAuthority("EDUCATOR")
                                                .antMatchers(HttpMethod.POST, "/api/student/register/{eventId}")
                                                .hasAnyAuthority("STUDENT")
                                                .antMatchers(HttpMethod.GET,
                                                                "/api/student/registration-status/{studentId}")
                                                .hasAnyAuthority("STUDENT")
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
                return http.getSharedObject(AuthenticationManagerBuilder.class)
                                .userDetailsService(userDetailsService)
                                .passwordEncoder(passwordEncoder)
                                .and()
                                .build();
        }
}