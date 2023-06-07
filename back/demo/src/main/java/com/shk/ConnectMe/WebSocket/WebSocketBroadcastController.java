package com.shk.ConnectMe.WebSocket;


import DTO.MessageResponse;
import DTO.actionEvent;

import java.util.Date;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.shk.ConnectMe.Controller.MessageController;
import com.shk.ConnectMe.Model.Message;
import com.shk.ConnectMe.Model.User;
import com.shk.ConnectMe.Repository.MessageRepository;
import com.shk.ConnectMe.Repository.UserRepository;

@Controller
public class WebSocketBroadcastController {
	Logger log = LoggerFactory.getLogger(WebSocketBroadcastController.class);
	@Autowired
	private UserRepository user_rpt; 
	@Autowired
	private MessageRepository msg_rpt;
	    
	    @Transactional
	    @MessageMapping("/broadcast")
	    @SendTo("/topic/messages")
	    public actionEvent send( actionEvent action) throws Exception {
	    	//MessageResponse(String time, String text, boolean seen, String sender, String reciever)
	    	// Message(String time, String text, boolean seen, User sender, User reciever)
	    	try {
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
				action.setTime(Long.toString(date.getTime()));
				action.getMsgr().setTime(Long.toString(date.getTime()));
				
				Message m = new Message(action.getMsgr().getTime(),action.getMsgr().getText(),action.getMsgr().isSeen(),this.user_rpt.getUsersByKey(action.getMsgr().getSender()),this.user_rpt.getUsersByKey(action.getMsgr().getReciever()),action.getMsgr().getType());
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
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	        return action;
	    }

}
