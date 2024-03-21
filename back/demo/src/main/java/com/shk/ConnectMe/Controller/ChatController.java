package com.shk.ConnectMe.Controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
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
import com.shk.ConnectMe.Model.UserChat;
import com.shk.ConnectMe.Repository.ChatRepository;
import com.shk.ConnectMe.Repository.MessageRepository;
import com.shk.ConnectMe.Repository.UserChatRepository;
import com.shk.ConnectMe.Repository.UserRepository;
import com.shk.ConnectMe.utils.Support;

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
	@Autowired
	private UserChatRepository usrcht_rpt;
	
	
	
//	private JSONObject job_info= new JSONObject();
//
//	private List<Chat> chat = new ArrayList<Chat>();
//	private List<Chathead> chatHeads = new ArrayList<Chathead>();
//	
//	private List<Message> messages = new ArrayList<Message>();
//	private List<MessageResponse> messagesResponse = new ArrayList<>();
//	
//	private String time;
//	private static Date date;
	
	@PostMapping("/create")
	ResponseEntity<?> register(@RequestBody String[] name) {
		JSONObject ans = new JSONObject();
		
		
		JSONObject job_info = new JSONObject();
		try {
			
			User u = this.user_rpt.getUsersByKey(name[0]);// key means username
			User u2 = this.user_rpt.getUsersByKey(name[1]);
			
			List<Chat> tchat =this.chat_rpt.doesChatwithNameexists(u.getName().trim()+"_"+u2.getName().trim(), u2.getName().trim()+"_"+u.getName().trim());
			
			if(tchat.size()>0) {
				if(tchat.size()==1) {
					ans.put("id", tchat.get(0).getId());
				}else {
					for(int i=0;i<tchat.size();i++) {
						ans.put("id"+String.valueOf(i), tchat.get(i).getId());
					}
				}
			}else {
				String t = Support.now();
				long tl = Support.nowinmilisec();
				Chat chat = new Chat(name[0].trim()+"_"+name[1].trim(),0,t,null); 
				long chatid = this.chat_rpt.save(chat).getId();
				UserChat uc = new UserChat(chat,u,tl,0);
				this.usrcht_rpt.save(uc);
				uc = new UserChat(chat,u2,tl,0);
				this.usrcht_rpt.save(uc);
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
		
		
		JSONObject job_info = new JSONObject();
		try {
			
			User u = this.user_rpt.getUsersByKey(name[0]);// key means username
			User u2 = this.user_rpt.getUsersByKey(name[1]);
			
			//this.chat =this.chat_rpt.doesChatwithNameexists(u.getName().trim()+"_"+u2.getName().trim(), u2.getName().trim()+"_"+u.getName().trim());         
			List<Chat> tchat =this.chat_rpt.doesChatwithUseridexists(u.getId(), u2.getId());         
			
			if(tchat.size()>0 ) {
				
				if(tchat.size()==1) {
					ans.put("id", tchat.get(0).getId());
				}else {
					for(int i=0;i<tchat.size();i++) {
						ans.put("id"+String.valueOf(i), tchat.get(i).getId());
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
		Date date = cal.getTime();
		return sdf.format(cal.getTime());
	}
	
	
	
	
	
	@PostMapping("/chathead")
	ResponseEntity<?> getchatheadbyidandUser(@RequestBody String[] data){
		
		
		
		
		Chathead chhd = null;
		Chat cht = null;
		try {
			if(data.length>2) {
				int limit = Integer.valueOf(data[2]);
				int offset = Integer.valueOf(data[4]);
				long id =Long.valueOf( data[0]);
				cht = this.chat_rpt.findById(id).get();
				User u = this.user_rpt.getUsersByKey(data[1]);
				//this.sendMessageToUsers(cht.getName().split("_"));
				UserChat uc = this.usrcht_rpt.getUserChatByuserandchatid(u.getId(), id);
				List<MessageResponse> tmessagesResponse = new ArrayList<>();
				if(uc!=null) {
					if(uc.getBlocked()==0) {
						List<Message> tmessages = this.msg_rpt.getMessagesbyChatIdoffset(id,uc.getMsglimit(),limit,u.getId(),offset);
						if(tmessages.size()==0) {
							this.log.warn("########################################## empty chat ###########################");
						}
						
						tmessages.forEach((msg)->{log.info(msg.getText());
							tmessagesResponse.add(new MessageResponse(msg.getId(),msg.getTime(),msg.getTimemili(),msg.getDeleted(),msg.getText(),msg.isSeen(),msg.getSender().getName(),msg.getReciever().getName(),msg.getType(), msg.getData(), String.valueOf(id)));
							
						});
						chhd=new Chathead(id,String.valueOf(cht.getUnreadMessageNo()),cht.getCreateTime(),cht.getName(),tmessagesResponse);
						
						return ResponseEntity.ok(chhd);
					}else {
						this.log.warn("user "+ data[1]+" is blocked from the chat with id "+ data[0]);
						return ResponseEntity.badRequest().body("user "+ data[1]+" is blocked from the chat with id "+ data[0]);
						
					}
				}else {
					if(cht!=null) {
						if(cht.getUserChatList().size()==2) {
							this.log.warn("this Chat is already Full with 2 members, This kind of request should not be send to back end , unless if you want to create a group chat, othewise Check chat list in chat page in front end code");
							return ResponseEntity.badRequest().body("this Chat is already Full with 2 members, This kind of request should not be send to back end , unless if you want to create a group chat, othewise Check chat list in chat page in front end code");
						}else {
							long tl = Long.valueOf(data[3]);
							if(tl==0) {
								tl=Support.nowinmilisec();
								String r = cht.getName().split("_")[0].equals(u.getName())?cht.getName().split("_")[1]:cht.getName().split("_")[0];
								Message m = new Message(
										Support.now(),
										tl,
										0,
										"Hi "+r+", This is "+u.getName(),
										true,
										u,
										this.user_rpt.getUsersByKey(r),
										"message",
										cht
										);
								this.msg_rpt.save(m);
							}
							UserChat uc2 = new UserChat(cht,u,tl,0);
							this.usrcht_rpt.save(uc2);
							
							
							if(uc2.getBlocked()==0) {
								List<Message> tmessages = this.msg_rpt.getMessagesbyChatIdoffset(id,uc2.getMsglimit(),limit,u.getId(),offset);
								if(tmessages.size()==0) {
									this.log.warn("########################################## empty chat ###########################");
								}
								
								tmessages.forEach((msg)->{log.info(msg.getText());
									tmessagesResponse.add(new MessageResponse(msg.getId(),msg.getTime(),msg.getTimemili(),msg.getDeleted(),msg.getText(),msg.isSeen(),msg.getSender().getName(),msg.getReciever().getName(),msg.getType(), msg.getData()));
									
								});
								chhd=new Chathead(String.valueOf(cht.getUnreadMessageNo()),cht.getCreateTime(),cht.getName(),tmessagesResponse);
								
								return ResponseEntity.ok(chhd);
							}else {
								this.log.warn("user "+ data[1]+" is blocked from the chat with id "+ data[0]);
								return ResponseEntity.badRequest().body("user "+ data[1]+" is blocked from the chat with id "+ data[0]);
								
							}
						}
						
					}else {
						this.log.warn("no chat head was found by the chatid "+ data[0]);
						return ResponseEntity.badRequest().body("no chat head was found by the chatid "+ data[0]);
					}
				}
			}else {
				this.log.warn("user or chat id is missing data might be empty, check parameters in requests");
				return ResponseEntity.badRequest().body("user or chat id is missing data might be empty, check parameters in requests");
			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			this.log.warn("Error Occured, may be no chat head was found by the chatid "+ data[0]);
			return ResponseEntity.badRequest().body("\"Error Occured, may be no chat head was found by the chatid "+ data[0]);
		}
	}
	
	
	@PostMapping("/chathead/user")
	ResponseEntity<?> getallchatheadforaUser(@RequestBody String[] username){
		
		try {
			
			User user1 = this.user_rpt.getUsersByKey(username[0]);
			List<Chathead> tchatHeads = new ArrayList<>();
			List<Chat> tchat = this.chat_rpt.getallChateadforauser(user1.getId());
			
			for(Chat cht : tchat ){
				
				List<MessageResponse> tmessagesResponse = new ArrayList<>();
				int unreadmsgno = this.msg_rpt.getNoOfUnreadMsgBychatid(cht.getId(),user1.getId());
				UserChat uc = this.usrcht_rpt.getUserChatByuserandchatid(user1.getId(), cht.getId());
				List<Message> tmessages =  this.msg_rpt.getMessagesbyChatId(cht.getId(),uc.getMsglimit(),1,user1.getId());
				if(tmessages.size()<1) {
					this.log.warn("empty chat");
				}else {
					Message msg = tmessages.get(tmessages.size()-1);
					tmessagesResponse.add(new MessageResponse(msg.getId(),msg.getTime(),msg.getTimemili(),msg.getDeleted(),msg.getText(),msg.isSeen(),msg.getSender().getName(),msg.getReciever().getName(),msg.getType(), msg.getData(),String.valueOf(msg.getChat().getId())));
					
				}
				
				
				
				 
			   Chathead chhd=new Chathead(cht.getId(),String.valueOf(unreadmsgno),cht.getCreateTime(),cht.getName(),tmessagesResponse);
			   tchatHeads.add(chhd);
			}
			
			
			
		return ResponseEntity.ok(tchatHeads);	
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().body("User"+username[0]+" has no chat");
		}
		
		
	}
}
