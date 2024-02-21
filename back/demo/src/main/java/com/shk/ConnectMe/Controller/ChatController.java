package com.shk.ConnectMe.Controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shk.ConnectMe.Model.Chat;
import com.shk.ConnectMe.Model.Geheim;
import com.shk.ConnectMe.Model.Message;
import com.shk.ConnectMe.Model.Profile;
import com.shk.ConnectMe.Model.User;
import com.shk.ConnectMe.Repository.ChatRepository;
import com.shk.ConnectMe.Repository.MessageRepository;
import com.shk.ConnectMe.Repository.UserRepository;

import DTO.Chathead;
import DTO.MessageResponse;
import DTO.actionEvent;

@RestController
@RequestMapping("/chat")
public class ChatController {
Logger log = LoggerFactory.getLogger(ChatController.class);
	
	@Autowired
	private ChatRepository chat_rpt;
	@Autowired
	private UserRepository user_rpt;
	@Autowired
	private MessageRepository msg_rpt;
	
	
	
	private JSONObject job_info= new JSONObject();

	private List<Chat> chat = new ArrayList<Chat>();
	private List<Chathead> chatHeads = new ArrayList<Chathead>();
	
	private List<Message> messages = new ArrayList<Message>();
	private List<MessageResponse> messagesResponse = new ArrayList<>();
	
	@PostMapping("/create")
	ResponseEntity<?> register(@RequestBody String[] name) {
		JSONObject ans = new JSONObject();
		
		
		this.job_info = new JSONObject();
		try {
			
			User u = this.user_rpt.getUsersByKey(name[0]);// key means username
			User u2 = this.user_rpt.getUsersByKey(name[1]);
			
			this.chat =this.chat_rpt.doesChatwithNameexists(u.getName().trim()+"_"+u2.getName().trim(), u2.getName().trim()+"_"+u.getName().trim());
			
			if(this.chat.size()>0) {
				if(this.chat.size()==1) {
					ans.put("id", this.chat.get(0).getId());
				}else {
					for(int i=0;i<this.chat.size();i++) {
						ans.put("id"+String.valueOf(i), this.chat.get(i).getId());
					}
				}
			}else {
				Chat chat = new Chat(name[0].trim()+"_"+name[1].trim(),0,this.now(),null); 
				int chatid = this.chat_rpt.save(chat).getId();
				this.user_rpt.UpdateUser_ChatEntryrole(String.valueOf(u.getId()), String.valueOf(chatid));
				this.user_rpt.UpdateUser_ChatEntryrole(String.valueOf(u2.getId()), String.valueOf(chatid));
				ans.put("id", chatid);

				
			}
			return ResponseEntity.ok(ans.toJSONString());	

		} catch (Exception e) {
			// TODO Auto-generated catch block
			
			ans.put("id", "");
			e.printStackTrace();
			return ResponseEntity.badRequest().build();
		}

	}
	
	@PostMapping("/findchatidoftwouser")
	ResponseEntity<?> findchatidoftwouser(@RequestBody String[] name) {
		JSONObject ans = new JSONObject();
		
		
		this.job_info = new JSONObject();
		try {
			
			User u = this.user_rpt.getUsersByKey(name[0]);// key means username
			User u2 = this.user_rpt.getUsersByKey(name[1]);
			
			//this.chat =this.chat_rpt.doesChatwithNameexists(u.getName().trim()+"_"+u2.getName().trim(), u2.getName().trim()+"_"+u.getName().trim());         
			this.chat =this.chat_rpt.doesChatwithUseridexists(u.getId(), u2.getId());         
			
			if(this.chat.size()>0 ) {
				
				if(this.chat.size()==1) {
					ans.put("id", this.chat.get(0).getId());
				}else {
					for(int i=0;i<this.chat.size();i++) {
						ans.put("id"+String.valueOf(i), this.chat.get(i).getId());
					}
				}
			}else {
				ans.put("id", "");

				
			}
			return ResponseEntity.ok(ans.toJSONString());	

		} catch (Exception e) {
			// TODO Auto-generated catch block
			
			ans.put("id", "");
			e.printStackTrace();
			return ResponseEntity.badRequest().build();
		}

	}

	public static final String DATE_FORMAT_NOW = "yyyy-MM-dd HH:mm:ss";

	public static String now() {
		Calendar cal = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT_NOW);
		return sdf.format(cal.getTime());
	}
	
	
	
	@PostMapping("/chathead")
	ResponseEntity<?> getchatheadbyid(@RequestBody String[] chatid){
		
		
		
		
		Chathead chhd = null;
		Chat cht = null;
		try {
			int id =Integer.valueOf( chatid[0]);
			cht = this.chat_rpt.findById(id).get();
			//this.sendMessageToUsers(cht.getName().split("_"));
			this.messagesResponse = new ArrayList<>();
			this.messages = this.msg_rpt.getMessagesbyChatId(id);
			if(this.messages.size()==0) {
				this.log.warn("########################################## empty chat ###########################");
			}
			messages.forEach((msg)->{log.info(msg.getText());
				this.messagesResponse.add(new MessageResponse(msg.getId(),msg.getTime(),msg.getText(),msg.isSeen(),msg.getSender().getName(),msg.getReciever().getName(),msg.getType(), msg.getData()));
				
			});
			chhd=new Chathead(String.valueOf(cht.getUnreadMessageNo()),cht.getCreateTime(),cht.getName(),this.messagesResponse);
			
			return ResponseEntity.ok(chhd);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().body("no chat head was found by the chatid "+ chatid[0]);
		}
	}
	
	
	@PostMapping("/chathead/user")
	ResponseEntity<?> getallchatheadforaUser(@RequestBody String[] username){
		
		try {
			
			User user1 = this.user_rpt.getUsersByKey(username[0]);
			this.chatHeads = new ArrayList<>();
			this.chat = this.chat_rpt.getallChateadforauser(user1.getId());
			
			for(Chat cht : this.chat ){
				
				this.messagesResponse = new ArrayList<>();
				int unreadmsgno = this.msg_rpt.getNoOfUnreadMsgBychatid(cht.getId(),user1.getId());
				this. messages =  this.msg_rpt.getMessagesbyChatId(cht.getId());
				if(this.messages.size()<1) {
					this.log.warn("empty chat");
				}else {
					Message msg = messages.get(messages.size()-1);
					this.messagesResponse.add(new MessageResponse(msg.getId(),msg.getTime(),msg.getText(),msg.isSeen(),msg.getSender().getName(),msg.getReciever().getName(),msg.getType(), msg.getData(),String.valueOf(msg.getChat().getId())));
					
				}
				
				
				
				 
			   Chathead chhd=new Chathead(cht.getId(),String.valueOf(unreadmsgno),cht.getCreateTime(),cht.getName(),this.messagesResponse);
			   this.chatHeads.add(chhd);
			}
			
			
			
		return ResponseEntity.ok(this.chatHeads);	
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().body("User"+username[0]+" has no chat");
		}
		
		
	}
}
