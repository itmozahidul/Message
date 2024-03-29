package com.shk.ConnectMe.WebSocket;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketMessageBrokerConfig implements WebSocketMessageBrokerConfigurer {
   
	
   /**
 *
 */
@Override
   public void configureMessageBroker(MessageBrokerRegistry config) {
       config.enableSimpleBroker("/topic","/queue","/call");
       config.setApplicationDestinationPrefixes("/app","/webrtc");
       config.setUserDestinationPrefix("/users");
		/*
		 * .setHeartbeatValue(new long[] {10000, 20000})
		 * .setTaskScheduler(this.msgbrkSchdlr)
		 */
   }

   @Override
   public void registerStompEndpoints(StompEndpointRegistry registry) {
       registry.addEndpoint("/ws")
       //.setHandshakeHandler(new UserHandshakeHandler())
       .setAllowedOrigins("*");
       registry.addEndpoint("/call").setAllowedOriginPatterns("*");
   }
   
	/*
	 * @Autowired public void setMessageBrokerTaskScheduler(TaskScheduler
	 * taskScheduler) { this.msgbrkSchdlr = taskScheduler; }
	 */
   
   @Override
   public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
       registration.setMessageSizeLimit(2000000000); // default : 64 * 1024
       registration.setSendTimeLimit(20 * 10000000); // default : 10 * 10000
       registration.setSendBufferSizeLimit(10* 512 * 1024); // default : 512 * 1024

   }
   
   @Override
   public void configureClientInboundChannel(ChannelRegistration registration) {
	   //registration.taskExecutor().corePoolSize(2)//look into it for production
       registration.interceptors(new UserInterceptor());
   }
}
