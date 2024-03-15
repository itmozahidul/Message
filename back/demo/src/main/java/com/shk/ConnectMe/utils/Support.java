package com.shk.ConnectMe.utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import DTO.MessageResponse;
import DTO.actionEvent;


public class Support {
	@Autowired
	public static SimpMessagingTemplate messagingTemplate;
	
	public static final String DATE_FORMAT_NOW = "yyyy-MM-dd HH:mm:ss";

	public static String now() {
		Calendar cal = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT_NOW);
		return sdf.format(cal.getTime());
	}
	
	public static long nowinmilisec() {
		return  Calendar.getInstance().getTimeInMillis();
	}
	
//	public static void sendMessageToUsers(String[] users, String text, String type) {
//		for(String u: users) {
//			MessageResponse data = new MessageResponse(0,now(),text,true,"backend",u);
//				actionEvent action = new actionEvent(now(),type,"backend",u,data) ;
//				messagingTemplate.convertAndSendToUser(action.getTo(), "/queue/reply", action);
//		}
//		
//	}
}
