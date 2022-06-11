package com.shk.ConnectMe.Controller;

import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shk.ConnectMe.Model.Geheim;
import com.shk.ConnectMe.Model.Message;
import com.shk.ConnectMe.Model.User;
import com.shk.ConnectMe.Repository.GeheimRepository;
import com.shk.ConnectMe.Repository.MessageRepository;
import com.shk.ConnectMe.Repository.UserRepository;
import com.shk.ConnectMe.utils.JwtTokenUtil;


@CrossOrigin
@RestController
@RequestMapping("/message")
public class MessageController {
	
	@Autowired
	private MessageRepository msg_rpt;
	@Autowired
	private UserRepository user_rpt;
	@Autowired
	private GeheimRepository geheim_rpt;
	private String jwt = "";
	private JSONObject job_info= new JSONObject();
	@Autowired
	private JwtTokenUtil jwtutil;
	private List<Message> messages = new ArrayList<Message>();
	
	@PostMapping("/all")
	ResponseEntity<?> register(@RequestBody String string_info){
		
		try {
			
			
			
			List<Message> messagesTemp = (List<Message>) this.msg_rpt.findAll();
			messagesTemp.forEach((msg)->{
				if(msg.getSender().getName().equals(string_info) || msg.getReciever().getName().equals(string_info)) {
					this.messages.add(msg);
				}
			});
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return ResponseEntity.ok(this.messages);
	}
	
	@PostMapping("/user")
	ResponseEntity<?> getMessageOfUser(@RequestBody String username){
		
		try {
			
			User user = this.user_rpt.getUsersByKey(username);
			
			this.messages = this.msg_rpt.getMessagesByUser(user.getId());
			
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return ResponseEntity.ok(this.messages);
	}

}
