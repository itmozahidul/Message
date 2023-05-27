package com.shk.ConnectMe.Model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
@Table(name = "Geheim")
public class Geheim {
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
    private String pkey;
    private String pass;
    
	

	
	  @OneToOne(fetch = FetchType.LAZY)
	  @JoinColumn(name = "user_id", nullable = false, unique = true) 
	  @JsonIgnoreProperties({"card","sendMessageList","recievedMessageList"})
	  
	  private User user;
	 

	public Geheim( String pass) {
		super();
		this.pkey = "";
		this.pass = pass;
	}


	public Geheim() {
		super();
		// TODO Auto-generated constructor stub
	}


	public int getId() {
		return id;
	}


	public void setId(int id) {
		this.id = id;
	}


	public String getKey() {
		return pkey;
	}


	public void setKey(String key) {
		this.pkey = key;
	}


	public String getPass() {
		return pass;
	}


	public void setPass(String pass) {
		this.pass = pass;
	}


	public User getUser() {
		return user;
	}


	public void setUser(User user) {
		this.user = user;
	}
	
	

}
