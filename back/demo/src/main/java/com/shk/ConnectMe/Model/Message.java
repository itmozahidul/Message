package com.shk.ConnectMe.Model;

import javax.persistence.Entity;
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
	private int id;
    private String time;
    private String text;
    private boolean seen;
    
    @JsonIgnoreProperties({"sendMessageList","recievedMessageList"})
    @ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sender", nullable = false ) 
    private User sender;
    
    @JsonIgnoreProperties({"sendMessageList","recievedMessageList"})
    @ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "reciever", nullable = false) 
    private User reciever;
    
	public Message() {
		// TODO Auto-generated constructor stub
	}

	public Message(String time, String text, boolean seen, User sender, User reciever) {
		super();
		this.time = time;
		this.text = text;
		this.seen = seen;
		this.sender = sender;
		this.reciever = reciever;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
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
	
	

}
