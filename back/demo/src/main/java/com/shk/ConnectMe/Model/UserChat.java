package com.shk.ConnectMe.Model;

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
	private int id;
	
	@JsonIgnoreProperties({"MessageList"})
    @ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "chatid", nullable = false ) 
    private Chat chatid;
	private int userid;
	private int msglimit;

	public UserChat() {
		// TODO Auto-generated constructor stub
	}

	public UserChat(int userid, int chatid, int msglimit) {
		super();
		this.userid = userid;
		this.chatid = chatid;
		this.msglimit = msglimit;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getUserid() {
		return userid;
	}

	public void setUserid(int userid) {
		this.userid = userid;
	}

	public int getChatid() {
		return chatid;
	}

	public void setChatid(int chatid) {
		this.chatid = chatid;
	}

	public int getMsglimit() {
		return msglimit;
	}

	public void setMsglimit(int msglimit) {
		this.msglimit = msglimit;
	}
	
	

	
	

}
