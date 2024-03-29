package com.shk.ConnectMe.Model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
public class Message {
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
    private String time;
    private long timemili;
    private int deleted;
    private String text;
    private String type;
    private boolean seen;
    @Column(columnDefinition="TEXT")
    private String data;
    
    
    @JsonIgnoreProperties({"sendMessageList","recievedMessageList"})
    @ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sender", nullable = true ) //only sender can nullify a message
    private User sender;
    
    @JsonIgnoreProperties({"sendMessageList","recievedMessageList"})
    @ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "reciever", nullable = false) 
    private User reciever;
    
    @JsonIgnoreProperties({"MessageList"})
    @ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "chat", nullable = false ) 
    private Chat chat;
    
	public Message() {
		// TODO Auto-generated constructor stub
	}

	public Message(String time,long timemili,int deleted, String text, boolean seen, User sender, User reciever) {
		super();
		this.time = time;
		this.timemili=timemili;
		this.deleted=deleted;
		this.text = text;
		this.seen = seen;
		this.sender = sender;
		this.reciever = reciever;
		this.data = "";
	}
	
	public Message(String time,long timemili,int deleted, String text, boolean seen, User sender, User reciever, String type, Chat chat) {
		super();
		this.time = time;
		this.deleted= deleted;
		this.text = text;
		this.seen = seen;
		this.sender = sender;
		this.reciever = reciever;
		this.data = "";
		this.type= type;
		this.chat =chat;
		this.timemili=timemili;
	}
	
	

	public long getTimemili() {
		return timemili;
	}

	public void setTimemili(long timemili) {
		this.timemili = timemili;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public boolean isSeen() {
		return seen;
	}

	public void setSeen(boolean seen) {
		this.seen = seen;
	}

	public User getSender() {
		return sender;
	}

	public void setSender(User sender) {
		this.sender = sender;
	}

	public User getReciever() {
		return reciever;
	}

	public void setReciever(User reciever) {
		this.reciever = reciever;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Chat getChat() {
		return chat;
	}

	public void setChat(Chat chat) {
		this.chat = chat;
	}

	public int getDeleted() {
		return deleted;
	}

	public void setDeleted(int deleted) {
		this.deleted = deleted;
	}
	
	
	

}
