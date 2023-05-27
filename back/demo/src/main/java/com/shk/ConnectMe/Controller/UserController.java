package com.shk.ConnectMe.Controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shk.ConnectMe.Model.Geheim;
import com.shk.ConnectMe.Model.RestResponse;
import com.shk.ConnectMe.Model.SpokenToEntry;
import com.shk.ConnectMe.Model.User;
import com.shk.ConnectMe.Repository.GeheimRepository;
import com.shk.ConnectMe.Repository.UserRepository;
import com.shk.ConnectMe.utils.JwtTokenUtil;

import org.json.simple.parser.ParseException;
import org.json.simple.parser.JSONParser;

import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONObject;

import DTO.SearchedUser;
import DTO.UserRegister;


@RestController
@RequestMapping("/user")
public class UserController {
	
	@Autowired
	private UserRepository user_rpt;
	@Autowired
	private GeheimRepository geheim_rpt;
	private String jwt = "";
	private JSONObject job_info= new JSONObject();
	@Autowired
	private JwtTokenUtil jwtutil;
	
	private List<SearchedUser> smlObjUsers =  new ArrayList<SearchedUser>();
	private List<User> Objusers =  new ArrayList<User>();
	private List<String> names =  new ArrayList<String>();
	
	@PostMapping("/register")
	ResponseEntity<?> register(@RequestBody String string_info){
		JSONObject ans = new JSONObject();
		ans.put("name", "User");
		ans.put("result", "false");
		this.job_info= new JSONObject();
		try {
			job_info = (JSONObject)new JSONParser().parse(string_info);
			User user =new User(
			"",
			this.job_info.get("fname").toString(),
			this.job_info.get("lname").toString(),
			this.job_info.get("mobile").toString(),
			this.job_info.get("adress").toString(),
			this.job_info.get("image").toString()
			                   );
			Geheim geheim = new Geheim(
					this.job_info.get("imp").toString()
					);
			geheim.setUser(user);
			user.setCard(geheim);
			User user2 = this.user_rpt.save(user);
			user2.setName(user2.getFirstName()+user2.getId());
			user2 = this.user_rpt.save(user2);
			ans.put("name", user2.getName());
			ans.put("result", "true");
			
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return ResponseEntity.ok(ans.toJSONString());
	}
	
	@PostMapping("/search")
	ResponseEntity<?> search(@RequestBody String key){
		
		try { //this.user_rpt.getUsersByKey("shakil");
			this.names = this.user_rpt.getSearchedUserNamesByKey(key);
//			List<User> users = this.user_rpt.getUsersByKey(key);
//			for(User u:users) {
//				this.userNames.add(new SearchedUser(u.getName(),u.getImage()));
//			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return ResponseEntity.ok(this.names);
	}
	
	@PostMapping("/spokenTo")
	ResponseEntity<?> getSpokenTo(@RequestBody String key){
		String spokenTo="";
		try { //this.user_rpt.getUsersByKey("shakil");
			User u = this.user_rpt.getUsersByKey(key);//key means username
			spokenTo = u.getSpokenTo();
//			List<User> users = this.user_rpt.getUsersByKey(key);
//			for(User u:users) {
//				this.userNames.add(new SearchedUser(u.getName(),u.getImage()));
//			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return ResponseEntity.ok(new SpokenToEntry(spokenTo));
	}
	
	@PostMapping("/login")
	ResponseEntity<?> login(@RequestBody String string_info){
		this.jwt=null;
		this.job_info= new JSONObject();
		try {
			this.job_info = (JSONObject)new JSONParser().parse(string_info);
			this.user_rpt.findAll().forEach(
					(u)->{
						if(u.getAdress().equals(this.job_info.get("adress").toString())) {
							this.geheim_rpt.findAll().forEach(
									(g)->{
										if(g.getUser().getId()== u.getId() && g.getPass().equals(this.job_info.get("imp").toString()) ) {
											this.jwt= this.jwtutil.generateToken(u.getName());
											
										}
									}
									);
						}
					}
					);
			
			
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return ResponseEntity.ok(new RestResponse(this.jwt));
	}

}
