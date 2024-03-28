package com.shk.ConnectMe.WebSocket;


import DTO.Location;
import DTO.MessageResponse;
import DTO.Rtcdata;
import DTO.actionEvent;

import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.shk.ConnectMe.Controller.MessageController;
import com.shk.ConnectMe.Controller.UserController;
import com.shk.ConnectMe.Model.Chat;
import com.shk.ConnectMe.Model.Message;
import com.shk.ConnectMe.Model.Profile;
import com.shk.ConnectMe.Model.User;
import com.shk.ConnectMe.Model.UserChat;
import com.shk.ConnectMe.Repository.ChatRepository;
import com.shk.ConnectMe.Repository.MessageRepository;
import com.shk.ConnectMe.Repository.ProfileRepository;
import com.shk.ConnectMe.Repository.UserChatRepository;
import com.shk.ConnectMe.Repository.UserRepository;
import com.shk.ConnectMe.service.UtilService;
import com.shk.ConnectMe.utils.Support;

@Controller
public class WebSocketBroadcastController {
	Logger log = LoggerFactory.getLogger(WebSocketBroadcastController.class);
	@Autowired
	private UserRepository user_rpt; 
	@Autowired
	private MessageRepository msg_rpt;
	@Autowired
	private ChatRepository chat_rpt;
	@Autowired
	private ProfileRepository prf_rpt;
	@Autowired
	private UtilService uts;
	@Autowired
	private UserChatRepository usrcht_rpt;
	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	    
	    @Transactional
	    @MessageMapping("/broadcast")
	    @SendTo("/topic/messages")
	    public actionEvent send( actionEvent action) throws Exception {
	    	//MessageResponse(String time, String text, boolean seen, String sender, String reciever)
	    	// Message(String time, String text, boolean seen, User sender, User reciever)
	    	try {
	    		if(action.getType().equals("location")) {
	    			
	    			String users_string = this.getUserSpokenTo(action.getFrom());
	    			action.setTo(users_string);
	    			
	    		}else if(action.getType().equals("location_share")) {
	    			// nothing just pass the same data to reciever
	    		}
	    		else {
				User sender = this.user_rpt.getUsersByKey(action.getMsgr().getSender());
				User reciever = this.user_rpt.getUsersByKey(action.getMsgr().getReciever());
				
				String sendersSpokenTo = sender.getSpokenTo();
				if(!sendersSpokenTo.contains(reciever.getName())) {
					sendersSpokenTo = (sendersSpokenTo.length()>0? sendersSpokenTo+" ":"")+reciever.getName();
					this.user_rpt.UpdateUserSpokenToEntry(sendersSpokenTo, sender.getName());
				}
				
				String recieversSpokenTo = reciever.getSpokenTo();
				if(!recieversSpokenTo.contains(sender.getName())) {
					recieversSpokenTo = (recieversSpokenTo.length()>0?recieversSpokenTo+" ":"")+sender.getName();
					this.user_rpt.UpdateUserSpokenToEntry(recieversSpokenTo, reciever .getName());
				}
				
				
				Date date = new Date();
				String t = Support.now();
				long tl = Support.nowinmilisec();
				action.setTime(t);
				action.setTimemili(tl);
				action.getMsgr().setTime(t);
				action.getMsgr().setTimemili(tl);
				
				Message m = new Message(
						action.getMsgr().getTime(),
						action.getMsgr().getTimemili(),
						action.getMsgr().getDeleted(),
						action.getMsgr().getText(),
						action.getMsgr().isSeen(),
						this.user_rpt.getUsersByKey(action.getMsgr().getSender()),
						this.user_rpt.getUsersByKey(action.getMsgr().getReciever()),
						action.getMsgr().getType(),
						this.chat_rpt.getChateadById(Long.valueOf(action.getMsgr().getChatid()))
						);
				try {
					String blob_stringed_data = action.getMsgr().getData();
					if(!blob_stringed_data.equals("null") && !blob_stringed_data.isEmpty()) {
						m.setData(blob_stringed_data);
						
					}
				} catch (Exception e) {
					// TODO Auto-generated catch block
					m.setData("");
				}
				
				log.info("msg saved");
				MessageResponse mr = action.getMsgr();
				mr.setId(this.msg_rpt.save(m).getId());
				mr.setData(action.getMsgr().getData());
				action.setMsgr(mr);
	    	}
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	        return action;
	    }
	    
	    @MessageMapping("/call")
	    public void callToSpecificUser( Rtcdata action, Principal user, 
	    		  @Header("simpSessionId") String sessionId) throws Exception {
	    	try {
	    		if(action.getType().equals("answer") || action.getType().equals("candidate") || action.getType().equals("offer") ||
	    				action.getType().equals("answer2") || action.getType().equals("candidate2") || action.getType().equals("offer2") ||
	    				action.getType().equals("pausevideo") || action.getType().equals("requesttomute")|| action.getType().equals("connected") ) {
	    			this.messagingTemplate.convertAndSendToUser(action.getReciever(), "/call/reply", action);
	    	    }
	    	}catch(Exception e) {
	    		e.printStackTrace();
	    	}
	    }
	    
	    @MessageMapping("/message")
	    //@SendToUser("/topic/reply")
	    public void sendToSpecificUser( actionEvent action, Principal user, 
	    		  @Header("simpSessionId") String sessionId) throws Exception {
	    	//MessageResponse(String time, String text, boolean seen, String sender, String reciever)
	    	// Message(String time, String text, boolean seen, User sender, User reciever)
	    	try {
	    		if(action.getType().equals("location")) {
	    			
	    			String users_string = this.getUserSpokenTo(action.getFrom());
	    			action.setTo(users_string);
	    			this.messagingTemplate.convertAndSendToUser(action.getTo(), "/queue/reply", action);
					this.messagingTemplate.convertAndSendToUser(action.getFrom(), "/queue/reply", action);
	    		}else if(action.getType().equals("location_share")) {
	    			// nothing just pass the same data to reciever
	    			this.messagingTemplate.convertAndSendToUser(action.getTo(), "/queue/reply", action);
					this.messagingTemplate.convertAndSendToUser(action.getFrom(), "/queue/reply", action);
	    		}else if(action.getType().equals("msgseennotify")) {
	    			try {
	    				this.msg_rpt.UpdateMessage(action.getMsgr().isSeen(), action.getMsgr().getId());
	    				Chat tempcht = this.chat_rpt.getChateadById(Long.valueOf(action.getMsgr().getChatid()));
	    				int unreadmsgno = tempcht.getUnreadMessageNo();
	    				unreadmsgno = unreadmsgno>0?unreadmsgno-1:unreadmsgno;
	    				this.chat_rpt.UpdateunreadMessageNoOfAChat(unreadmsgno, tempcht.getId());
	    				this.messagingTemplate.convertAndSendToUser(action.getMsgr().getReciever(), "/queue/reply", action);
					    this.messagingTemplate.convertAndSendToUser(action.getMsgr().getSender(), "/queue/reply", action);
	    				
	    			} catch (Exception e) {
	    				// TODO Auto-generated catch block
	    				e.printStackTrace();
	    			}
	    			
	    		}else if(action.getType().equals("msgseennotifyall")) {
	    			try {
	    				
	    				String username=action.getFrom().trim();
	    				int chatid = Integer.valueOf(action.getMsgr().getChatid().trim());
	    				User u = this.user_rpt.getUsersByKey(username);
	    				
	    				int unreadmsgno = this.msg_rpt.getNoOfUnreadMsgBychatid(chatid,u.getId());
	    				if(unreadmsgno!=0) {
	    					this.msg_rpt.UpdateallMessageseenforaUser(chatid,u.getId());
	    					this.chat_rpt.UpdateunreadMessageNoOfAChat(unreadmsgno, chatid);
	    					this.messagingTemplate.convertAndSendToUser(action.getMsgr().getReciever(), "/queue/reply", action);
						    this.messagingTemplate.convertAndSendToUser(action.getMsgr().getSender(), "/queue/reply", action);
	    				}
	    				
	    				
	    				
	    				
	    			} catch (Exception e) {
	    				// TODO Auto-generated catch block
	    				e.printStackTrace();
	    			}
	    		}
	    		else if(action.getType().equals("chatdelete")) {
	    			try {
	    				String username=action.getFrom().trim();
	    				long chatid = Integer.valueOf(action.getMsgr().getChatid().trim());
	    				User u = this.user_rpt.getUsersByKey(username);
	    				int userids[] = this.chat_rpt.getusersinchat(chatid);
	    				if(userids.length>0) {
	    					if(userids.length==1) {
	    						if(userids[0]==u.getId()) {
	    							this.chat_rpt.deleteuserfromauserchatrelation(chatid, userids[0]);
	    							this.msg_rpt.deleteMessagesByChatid(chatid);
	    							this.chat_rpt.deleteById(chatid);
	    							this.messagingTemplate.convertAndSendToUser(action.getFrom(), "/queue/reply", action);
	    						}
	    					}else {
	    						int deleted = 0;
	    						for(int userid : userids) {
		    						if(userid==u.getId()) {
		    							this.chat_rpt.deleteuserfromauserchatrelation(chatid, userid);
		    							deleted++;
		    						}
		    					}
	    						if(deleted>0) {
	    							this.messagingTemplate.convertAndSendToUser(action.getFrom(), "/queue/reply", action);
	    						}
	    					}
	    					
	    				}
	    			} catch (Exception e) {
	    				// TODO Auto-generated catch block
	    				e.printStackTrace();
	    			}
	    		}else if(action.getType().equals("messagedelete")) {
	    			try {
	    				long msgid = action.getMsgr().getId();
	    				this.msg_rpt.deleteaMessageByid(msgid);
	    				this.messagingTemplate.convertAndSendToUser(action.getTo(), "/queue/reply", action);
						this.messagingTemplate.convertAndSendToUser(action.getFrom(), "/queue/reply", action);
	    			} catch (Exception e) {
	    				// TODO Auto-generated catch block
	    				e.printStackTrace();
	    			}
	    		}else if(action.getType().equals("removesender")) {
	    			try {
	    				
	    				String sender=action.getFrom().trim();
	    				long msgid = action.getMsgr().getId();
	    				User us = this.user_rpt.getUsersByKey(sender);
	    				
	    				this.msg_rpt.UpdatemsgdeletedBysender(msgid, 1);
	    				action.getMsgr().setDeleted(1);
	    				
	    				this.messagingTemplate.convertAndSendToUser(action.getFrom(), "/queue/reply", action);
	    			} catch (Exception e) {
	    				// TODO Auto-generated catch block
	    				e.printStackTrace();
	    			}
	    		}
//	    			else if(action.getType().equals("answer") || action.getType().equals("candidate") || action.getType().equals("offer")) {
//	    			this.messagingTemplate.convertAndSendToUser(action.getTo(), "/queue/reply", action);
//	    	    }
	    		else if( action.getType().equals("call") || action.getType().equals("ansr") || action.getType().equals("end")) {
	    			this.messagingTemplate.convertAndSendToUser(action.getTo(), "/queue/reply", action);
	    	    }
	    		else if( action.getType().equals("free")) {
	    			this.messagingTemplate.convertAndSendToUser(action.getFrom(), "/queue/reply", action);
	    			this.messagingTemplate.convertAndSendToUser(action.getTo(), "/queue/reply", action);
	    	    }
	    		else if(action.getType().equals("message")) {
				User sender = this.user_rpt.getUsersByKey(action.getMsgr().getSender());
				User reciever = this.user_rpt.getUsersByKey(action.getMsgr().getReciever());
				long mchatid = Long.valueOf(action.getMsgr().getChatid());
				
				String sendersSpokenTo = sender.getSpokenTo();
				if(!sendersSpokenTo.contains(reciever.getName())) {
					sendersSpokenTo = (sendersSpokenTo.length()>0? sendersSpokenTo+" ":"")+reciever.getName();
					this.user_rpt.UpdateUserSpokenToEntry(sendersSpokenTo, sender.getName());
				}
				
				String recieversSpokenTo = reciever.getSpokenTo();
				if(!recieversSpokenTo.contains(sender.getName())) {
					recieversSpokenTo = (recieversSpokenTo.length()>0?recieversSpokenTo+" ":"")+sender.getName();
					this.user_rpt.UpdateUserSpokenToEntry(recieversSpokenTo, reciever .getName());
				}
				
				
				Date date = new Date();
				String t = Support.now();
				long tl = Support.nowinmilisec();
				action.setTime(t);
				action.setTimemili(tl);
				action.getMsgr().setTime(t);
				action.getMsgr().setTimemili(tl);
				Chat tempcht = this.chat_rpt.getChateadById(mchatid);
				UserChat uc = this.usrcht_rpt.getUserChatByuserandchatid(reciever.getId(), mchatid);
				if(uc==null) {
					UserChat uc2 = new UserChat(tempcht,reciever,tl,0);
					this.usrcht_rpt.save(uc2);
					this.log.warn("chat name "+tempcht.getName()+" was deleted by  "+ reciever.getName());
				}
				
				
				Message m = new Message(
						action.getMsgr().getTime(),
						action.getMsgr().getTimemili(),
						action.getMsgr().getDeleted(),
						action.getMsgr().getText(),
						action.getMsgr().isSeen(),
						this.user_rpt.getUsersByKey(action.getMsgr().getSender()),
						this.user_rpt.getUsersByKey(action.getMsgr().getReciever()),
						action.getMsgr().getType(),
						tempcht
						);
				try {
					String blob_stringed_data = action.getMsgr().getData();
					if(!blob_stringed_data.equals("null") && !blob_stringed_data.isEmpty()) {
						m.setData(blob_stringed_data);
						
					}
				} catch (Exception e) {
					// TODO Auto-generated catch block
					m.setData("");
				}
				
				log.info("msg saved");
				MessageResponse mr = action.getMsgr();
				mr.setId(this.msg_rpt.save(m).getId());
				int unreadmsgno = tempcht.getUnreadMessageNo();
				unreadmsgno++;
				this.chat_rpt.UpdateunreadMessageNoOfAChat(unreadmsgno, tempcht.getId());
				mr.setData(action.getMsgr().getData());
				action.setMsgr(mr);
				this.messagingTemplate.convertAndSendToUser(action.getTo(), "/queue/reply", action);
				this.messagingTemplate.convertAndSendToUser(action.getFrom(), "/queue/reply", action);
	    	}
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	       
	       
	        //this.messagingTemplate.convertAndSendToUser(user.getName(), "/queue/reply", action);
	    }
	    
	    
	    
	    private String getUserSpokenTo(String key) {
	    	try { // this.user_rpt.getUsersByKey("shakil");
				User u = this.user_rpt.getUsersByKey(key);// key means username
				String spokenTo = u.getSpokenTo();
//				List<User> users = this.user_rpt.getUsersByKey(key);
//				for(User u:users) {
//					this.userNames.add(new SearchedUser(u.getName(),u.getImage()));
//				}
				return spokenTo ;
				

			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return "";
			}
	    }
	    

}
