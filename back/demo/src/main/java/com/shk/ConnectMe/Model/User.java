/**
 * 
 */
package com.shk.ConnectMe.Model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * @author pc
 *
 */
@Entity
//@Table(name = "User")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
public class User {

	/**
	 * 
	 */
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private String name;
	private String fname;
	private String lname;
	private String spokento;
	
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "sender")
	@JsonIgnoreProperties({"sender","reciever"})
	private List<Message> sendMessageList;
	
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "reciever")
	@JsonIgnoreProperties({"sender","reciever"})
	private List<Message> recievedMessageList;
	
	  @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy =
	  "user") 
	  @JsonIgnoreProperties("user")
	  private Geheim card;
	 
	private String mobile;
	private String adress;
	
	 @Column(columnDefinition="TEXT")
	private String image;
	private String role;
	
	 @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy =
			  "user") 
			  @JsonIgnoreProperties("user")
			  private Profile profile;

	public User() {
		super();
		this.spokento="";
		// TODO Auto-generated constructor stub
	}

	public User(String name, String fname, String lname, List<Message> sendMessageList,
			List<Message> recievedMessageList, Geheim card, String mobile, String adress, String image) {
		super();
		this.name = name;
		this.fname = fname;
		this.lname = lname;
		this.sendMessageList = sendMessageList;
		this.recievedMessageList = recievedMessageList;
		this.spokento="";
		this.card = card;
		this.mobile = mobile;
		this.adress = adress;
		this.image = image;
	}
	public User(String name, String fname, String lname, String mobile, String adress, String image) {
		super();
		this.name = name;
		this.fname = fname;
		this.lname = lname;
		this.mobile = mobile;
		this.adress = adress;
		this.image = image;
		this.spokento="";
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

	



	public String getFname() {
		return fname;
	}

	public void setFname(String fname) {
		this.fname = fname;
	}

	public String getLname() {
		return lname;
	}

	public void setLname(String lname) {
		this.lname = lname;
	}

	public List<Message> getSendMessageList() {
		return sendMessageList;
	}

	public void setSendMessageList(List<Message> sendMessageList) {
		this.sendMessageList = sendMessageList;
	}

	public List<Message> getRecievedMessageList() {
		return recievedMessageList;
	}

	public void setRecievedMessageList(List<Message> recievedMessageList) {
		this.recievedMessageList = recievedMessageList;
	}

	public Geheim getCard() {
		return card;
	}

	public void setCard(Geheim card) {
		this.card = card;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getAdress() {
		return adress;
	}

	public void setAdress(String adress) {
		this.adress = adress;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getSpokenTo() {
		return spokento;
	}

	public void setSpokenTo(String spokenTo) {
		this.spokento = spokenTo;
	}

	public String getSpokento() {
		return spokento;
	}

	public void setSpokento(String spokento) {
		this.spokento = spokento;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public Profile getProfile() {
		return profile;
	}

	public void setProfile(Profile profile) {
		this.profile = profile;
	}

	
	
	
	
	
}
