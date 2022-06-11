package com.shk.ConnectMe.WebSocket;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketMessageBrokerConfig implements WebSocketMessageBrokerConfigurer {
   
	
   /**
 *
 */
@Override
   public void configureMessageBroker(MessageBrokerRegistry config) {
       config.enableSimpleBroker("/topic");
       config.setApplicationDestinationPrefixes("/app");
		/*
		 * .setHeartbeatValue(new long[] {10000, 20000})
		 * .setTaskScheduler(this.msgbrkSchdlr)
		 */
   }

   @Override
   public void registerStompEndpoints(StompEndpointRegistry registry) {
       registry.addEndpoint("/ws").setAllowedOrigins("*");
   }
   
	/*
	 * @Autowired public void setMessageBrokerTaskScheduler(TaskScheduler
	 * taskScheduler) { this.msgbrkSchdlr = taskScheduler; }
	 */
}
