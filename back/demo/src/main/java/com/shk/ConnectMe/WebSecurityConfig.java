package com.shk.ConnectMe;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.shk.ConnectMe.utils.JwtRequestFilter;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	@Autowired
	private JwtRequestFilter jwtRequestFilter;
	
   @Override
   protected void configure(HttpSecurity http) throws Exception {
      http=http.cors().and().csrf().disable();
      http = http.sessionManagement()
    		  .sessionCreationPolicy(SessionCreationPolicy.STATELESS).and();
         http.authorizeRequests()
            .antMatchers("/user/register").permitAll()
            
            //.antMatchers("/user/login").permitAll()
            .anyRequest().permitAll()
            .and()
         .formLogin()
            .loginPage("/login")
            .permitAll()
            .and()
            .logout()
            .permitAll().and();
         http = http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
   }
   @Autowired
   public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
      auth
         .inMemoryAuthentication()
         .withUser("user").password("password").roles("USER");
   }
}