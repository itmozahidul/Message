package com.shk.ConnectMe.Model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
public class Chat {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private String name;
	private String createTime;
	private int unreadMessageNo;
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "chat")
	@JsonIgnoreProperties({"chat"})
	private List<Message> MessageList;
	
	
	@ManyToMany(fetch = FetchType.LAZY,mappedBy = "chatheadlist",cascade = CascadeType.ALL)
    private List<User> users;
	
	public Chat() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public Chat(String name,int unreadMessageNo, String createTime, List<Message> messageList) {
		super();
		this.name = name;
		this.createTime = createTime;
		MessageList = messageList;
		this.unreadMessageNo= unreadMessageNo;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public List<Message> getMessageList() {
		return MessageList;
	}
	public void setMessageList(List<Message> messageList) {
		MessageList = messageList;
	}
	public int getUnreadMessageNo() {
		return unreadMessageNo;
	}
	public void setUnreadMessageNo(int unreadMessageNo) {
		this.unreadMessageNo = unreadMessageNo;
	}
	public List<User> getUsers() {
		return users;
	}
	public void setUsers(List<User> users) {
		this.users = users;
	}
	

}
