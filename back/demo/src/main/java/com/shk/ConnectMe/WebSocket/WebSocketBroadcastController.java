package com.shk.ConnectMe.WebSocket;


import DTO.MessageResponse;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.shk.ConnectMe.Model.Message;
import com.shk.ConnectMe.Model.User;
import com.shk.ConnectMe.Repository.MessageRepository;
import com.shk.ConnectMe.Repository.UserRepository;

@Controller
public class WebSocketBroadcastController {
	    
	@Autowired
	private UserRepository user_rpt; 
	@Autowired
	private MessageRepository msg_rpt;
	    
	    @Transactional
	    @MessageMapping("/broadcast")
	    @SendTo("/topic/messages")
	    public MessageResponse send( MessageResponse chatMessage) throws Exception {
	    	//MessageResponse(String time, String text, boolean seen, String sender, String reciever)
	    	// Message(String time, String text, boolean seen, User sender, User reciever)
	    	Message m = new Message(chatMessage.getTime(),chatMessage.getText(),chatMessage.isSeen(),this.user_rpt.getUsersByKey(chatMessage.getSender()),this.user_rpt.getUsersByKey(chatMessage.getReciever()));
	    	this.msg_rpt.save(m);
	        return chatMessage;
	    }

}
