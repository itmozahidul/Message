package com.shk.ConnectMe.utils;
import java.util.ArrayList;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.shk.ConnectMe.Repository.UserRepository;

@Service
public class JwtUserDetailsService implements UserDetailsService {
	
	private UserRepository usr_rp;
    private UserDetails ans=null;
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		this.ans=null;
		usr_rp.findAll().forEach(
				(u)->{
					if(u.getName().equals(username)) {
						this.ans= new User(username, "",new ArrayList<>());
					}
				});
		
		return ans;
	}

}
