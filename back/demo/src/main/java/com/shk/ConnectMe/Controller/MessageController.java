package com.shk.ConnectMe.Controller;

import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shk.ConnectMe.Model.Geheim;
import com.shk.ConnectMe.Model.Message;
import com.shk.ConnectMe.Model.User;
import com.shk.ConnectMe.Repository.GeheimRepository;
import com.shk.ConnectMe.Repository.MessageRepository;
import com.shk.ConnectMe.Repository.UserRepository;
import com.shk.ConnectMe.utils.JwtTokenUtil;

import DTO.MessageResponse;



@RestController
@RequestMapping("/message")
public class MessageController {
	
	Logger log = LoggerFactory.getLogger(MessageController.class);
	
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
	private List<MessageResponse> messagesResponse = new ArrayList<>();
	
	@PostMapping("/all")
	ResponseEntity<?> register(@RequestBody String string_info){//string_info is the username
		
		try {
			
			this.messagesResponse = new ArrayList<>();
			
			List<Message> messagesTemp = (List<Message>) this.msg_rpt.findAll();
			log.info(string_info);
			
			messagesTemp.forEach((msg)->{log.info(msg.getText());
				if(msg.getSender().getName().equals(string_info) || msg.getReciever().getName().equals(string_info)) {
					this.messagesResponse.add(new MessageResponse(msg.getId(),msg.getTime(),msg.getText(),msg.isSeen(),msg.getSender().getName(),msg.getReciever().getName()));
				}
			});
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return ResponseEntity.ok(this.messagesResponse);
	}
	
	@PostMapping("/user")
	ResponseEntity<?> getMessageOfUser(@RequestBody String[] username){
		
		try {
			
			User user1 = this.user_rpt.getUsersByKey(username[0]);
			User user2 = this.user_rpt.getUsersByKey(username[1]);
			this.messagesResponse = new ArrayList<>();
			this.messages = this.msg_rpt.getMessagesByUser(user1.getId(),user2.getId());
			messages.forEach((msg)->{log.info(msg.getText());
			   this.messagesResponse.add(new MessageResponse(msg.getId(),msg.getTime(),msg.getText(),msg.isSeen(),msg.getSender().getName(),msg.getReciever().getName()));
			});
			
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return ResponseEntity.ok(this.messagesResponse);
	}
	
	@PostMapping("/messageSeen")
	ResponseEntity<?> setMessageOfUserAsSeen(@RequestBody String[] data){
		
		
		boolean reply = false;
		try {
			boolean ans = false;
			if(data[1].equals("true")) {
				ans = true;
			}
			if(data[1].equals("false")) {
				ans = false;
			}
			long id = Long.parseLong(data[0]);
			this.msg_rpt.UpdateMessage(ans, id);
			reply = true;
			
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			reply = false;
		}
		
		return ResponseEntity.ok(reply);
	}

}
