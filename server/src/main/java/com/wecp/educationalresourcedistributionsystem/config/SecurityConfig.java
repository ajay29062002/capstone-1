package com.wecp.educationalresourcedistributionsystem.config;

import com.wecp.educationalresourcedistributionsystem.jwt.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

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

        @Override
        protected void configure(AuthenticationManagerBuilder auth) throws Exception {
                auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
                http.cors().and().csrf().disable()
                                .authorizeRequests()
                                .antMatchers("/api/user/register", "/api/user/login").permitAll()
                                .antMatchers(HttpMethod.POST, "/api/institution/event**").hasAnyAuthority("INSTITUTION")
                                .antMatchers(HttpMethod.GET, "/api/institution/events**").hasAnyAuthority("INSTITUTION")
                                .antMatchers(HttpMethod.POST, "/api/institution/resource**")
                                .hasAnyAuthority("INSTITUTION")
                                .antMatchers(HttpMethod.GET, "/api/institution/resources**")
                                .hasAnyAuthority("INSTITUTION")
                                .antMatchers(HttpMethod.POST, "/api/institution/event**").hasAnyAuthority("INSTITUTION")
                                .antMatchers(HttpMethod.POST, "/api/institution/event/allocate-resources**")
                                .hasAnyAuthority("INSTITUTION")
                                .antMatchers(HttpMethod.GET, "/api/educator/agenda**").hasAnyAuthority("EDUCATOR")
                                .antMatchers(HttpMethod.PUT, "/api/educator/update-material/{eventId}**")
                                .hasAnyAuthority("EDUCATOR")
                                .antMatchers(HttpMethod.POST, "/api/student/register/{eventId}**")
                                .hasAnyAuthority("STUDENT")
                                .antMatchers(HttpMethod.GET, "/api/student/registration-status/{studentId}**")
                                .hasAnyAuthority("STUDENT")
                                .anyRequest().authenticated()
                                .and()
                                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

                http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        }

        @Bean
        @Override
        public AuthenticationManager authenticationManagerBean() throws Exception {
                return super.authenticationManagerBean();
        }

}