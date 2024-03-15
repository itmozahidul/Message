package com.shk.ConnectMe.Model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
public class UserChat {
	
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@JsonIgnoreProperties({"userChatList","MessageList"})
    @ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "chatid", nullable = false ) 
    private Chat chatid;
	
	@JsonIgnoreProperties({"userChatList","sendMessageList","recievedMessageList","profile"})
    @ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "userid", nullable = false ) 
	private User userid;
	
	private long msglimit;
	private int blocked;

	public UserChat() {
		// TODO Auto-generated constructor stub
	}

	public UserChat(long msglimit) {
		super();
		this.msglimit = msglimit;
	}

	public UserChat(Chat chatid, User userid, long msglimit) {
		super();
		this.chatid = chatid;
		this.userid = userid;
		this.msglimit = msglimit;
	}

	public UserChat(Chat chatid, User userid) {
		super();
		this.chatid = chatid;
		this.userid = userid;
	}
	
	

	public UserChat(Chat chatid, User userid, long msglimit, int blocked) {
		super();
		this.chatid = chatid;
		this.userid = userid;
		this.msglimit = msglimit;
		this.blocked = blocked;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Chat getChatid() {
		return chatid;
	}

	public void setChatid(Chat chatid) {
		this.chatid = chatid;
	}

	public User getUserid() {
		return userid;
	}

	public void setUserid(User userid) {
		this.userid = userid;
	}

	public long getMsglimit() {
		return msglimit;
	}

	public void setMsglimit(long msglimit) {
		this.msglimit = msglimit;
	}

	public int getBlocked() {
		return blocked;
	}

	public void setBlocked(int blocked) {
		this.blocked = blocked;
	}
	
    
	
	
	

	
	

}
