package com.shk.ConnectMe.Controller;

import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.shk.ConnectMe.Model.Geheim;
import com.shk.ConnectMe.Model.Gifformat;
import com.shk.ConnectMe.Model.Message;
import com.shk.ConnectMe.Model.User;
import com.shk.ConnectMe.Repository.ChatRepository;
import com.shk.ConnectMe.Repository.GeheimRepository;
import com.shk.ConnectMe.Repository.MessageRepository;
import com.shk.ConnectMe.Repository.UserRepository;
import com.shk.ConnectMe.service.FileService;
import com.shk.ConnectMe.utils.GifProvider;
import com.shk.ConnectMe.utils.JwtTokenUtil;
import com.shk.ConnectMe.utils.Support;
import com.shk.ConnectMe.utils.TenorGifs;

import DTO.Chathead;
import DTO.FileResponse;
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
	private ChatRepository cht_rpt;
	@Autowired
	private GeheimRepository geheim_rpt;
	private String jwt = "";
	private JSONObject job_info= new JSONObject();
	@Autowired
	private JwtTokenUtil jwtutil;
	
//	private List<Message> messages = new ArrayList<Message>();
//	private List<MessageResponse> messagesResponse = new ArrayList<>();
//	private List<Gifformat> gifs = new ArrayList<>();
	
	@Autowired
	FileService fileService ;
	@Autowired
	TenorGifs gifservice;
	
	@PostMapping("/all")
	ResponseEntity<?> register(@RequestBody String string_info){//string_info is the username
		
		try {
			
			List<MessageResponse> tmessagesResponse = new ArrayList<>();
			
			List<Message> messagesTemp = (List<Message>) this.msg_rpt.findAll();
			log.info(string_info);
			
			messagesTemp.forEach((msg)->{log.info(msg.getText());
				if(msg.getSender().getName().equals(string_info) || msg.getReciever().getName().equals(string_info)) {
					tmessagesResponse.add(new MessageResponse(msg.getId(),msg.getTime(),msg.getTimemili(),msg.getDeleted(),msg.getText(),msg.isSeen(),msg.getSender().getName(),msg.getReciever().getName(),msg.getType(), msg.getData()));
				}
			});
			return ResponseEntity.ok(tmessagesResponse);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().body("No messages found for "+string_info);
			
		}
		
		
	}
	

	
	
	@PostMapping("/user")
	ResponseEntity<?> getMessageOfUseraschathead(@RequestBody String[] username){
		
		try {
			
			User user1 = this.user_rpt.getUsersByKey(username[0]);
			User user2 = this.user_rpt.getUsersByKey(username[1]);
			List<MessageResponse> tmessagesResponse = new ArrayList<>();
			List<Message> tmessages = this.msg_rpt.getMessagesByUser(user1.getId(),user2.getId());
			tmessages.forEach((msg)->{log.info(msg.getText());
			   tmessagesResponse.add(new MessageResponse(msg.getId(),msg.getTime(),msg.getTimemili(),msg.getDeleted(),msg.getText(),msg.isSeen(),msg.getSender().getName(),msg.getReciever().getName(),msg.getType(), msg.getData()));
			});
			return ResponseEntity.ok(tmessagesResponse);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().body("no messages found for "+username[0]+" and "+username[1]);
		}
		
		
	}
	
	@PostMapping("/id")
	ResponseEntity<?> getMessageOById(@RequestBody String[] data){
		
		try {
			
			String id = data[0];
			Long m_id = Long.valueOf(id);
			
			Message msg = this.msg_rpt.findById(m_id).get();
			MessageResponse mr =new MessageResponse(msg.getId(),msg.getTime(),msg.getTimemili(),msg.getDeleted(),msg.getText(),msg.isSeen(),msg.getSender().getName(),msg.getReciever().getName(),msg.getType(), msg.getData());
			
			return ResponseEntity.ok(mr);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().body("no messages found for id "+data[0]);
		}
		
		
	}
	
	@PostMapping("/till/id")
	ResponseEntity<?> getMessagesTillthisById(@RequestBody String[] data){
		
		try {
			
			String id = data[1];
			User user = this.user_rpt.getUsersByKey(data[0]);
			Long m_id = Long.valueOf(id);
			List<MessageResponse> tmessagesResponse = new ArrayList<>();
			Message ms = this.msg_rpt.findById(m_id).get();
			List<Message> tmessages = this.msg_rpt.getMessagesbyChatIdohneLimit(ms.getChat().getId(),ms.getTimemili(),user.getId());
			
			tmessages.forEach((msg)->{log.info(msg.getText());
			   tmessagesResponse.add(new MessageResponse(msg.getId(),msg.getTime(),msg.getTimemili(),msg.getDeleted(),msg.getText(),msg.isSeen(),msg.getSender().getName(),msg.getReciever().getName(),msg.getType(), msg.getData()));
			});
			return ResponseEntity.ok(tmessagesResponse);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().body("no messages found for id "+data[0]);
		}
		
		
	}
	
	@PostMapping("/gif")
	ResponseEntity<?> getgifs(@RequestBody String[] data){
		
		try {
			
			String key = data[0];
			List<Gifformat> tgifs=this.gifservice.getGif(key, 15);
			List<MessageResponse> tmessagesResponse = new ArrayList<>();
			return ResponseEntity.ok(tgifs);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().body("search for "+data[0]+" was failed");
		}
		
		
	}
	
//	@PostMapping("/all/messageSeen/user")
//	ResponseEntity<?> setallunseenMessageOfUserAsSeen(@RequestBody String[] chatids){
//		
//		
//		boolean reply = false;
//		try {
//			
//			User u = this.user_rpt.getUsersByKey(chatids[1]);
//			this.msg_rpt.UpdateallMessageseenforaUser(Integer.valueOf(chatids[0]),u.getId());
//			this.cht_rpt.UpdateunreadMessageNoOfAChat(0, Integer.valueOf(chatids[0]));
//			reply = true;
//			return ResponseEntity.ok(reply);
//			
//		} catch (Exception e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//			this.log.warn("Updating message seen status didn't work, see exception details");
//			reply = false;
//			return ResponseEntity.badRequest().body(reply);
//		}
//		
//		
//	}
	
	
	
	@PostMapping(path = "/uploadFile",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	ResponseEntity<FileResponse> uploadFile(@RequestParam("file") MultipartFile file) {
	    FileResponse ans = new FileResponse();
	    boolean reply = false;
		try {
			ans = this.fileService.save(file);
			return ResponseEntity.ok(ans);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().body(ans);
		}
	   
	}

}
