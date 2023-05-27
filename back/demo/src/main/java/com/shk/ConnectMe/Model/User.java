/**
 * 
 */
package com.shk.ConnectMe.Model;

import java.util.List;

import javax.persistence.CascadeType;
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
	private String firstName;
	private String lastName;
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
	 
	private String Mobile;
	private String Adress;
	private String image;

	public User() {
		super();
		this.spokento="";
		// TODO Auto-generated constructor stub
	}

	public User(String name, String firstName, String lastName, List<Message> sendMessageList,
			List<Message> recievedMessageList, Geheim card, String mobile, String adress, String image) {
		super();
		this.name = name;
		this.firstName = firstName;
		this.lastName = lastName;
		this.sendMessageList = sendMessageList;
		this.recievedMessageList = recievedMessageList;
		this.spokento="";
		this.card = card;
		Mobile = mobile;
		Adress = adress;
		this.image = image;
	}
	public User(String name, String firstName, String lastName, String mobile, String adress, String image) {
		super();
		this.name = name;
		this.firstName = firstName;
		this.lastName = lastName;
		Mobile = mobile;
		Adress = adress;
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

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
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
		return Mobile;
	}

	public void setMobile(String mobile) {
		Mobile = mobile;
	}

	public String getAdress() {
		return Adress;
	}

	public void setAdress(String adress) {
		Adress = adress;
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

	
	
	
	
	
}
