package DTO;

public class Rtcdata {
	String type;
	String sender;
	String reciever;
	String data;

	public Rtcdata() {
		// TODO Auto-generated constructor stub
	}

	public Rtcdata(String type, String sender, String reciever, String data) {
		super();
		this.type = type;
		this.sender = sender;
		this.reciever = reciever;
		this.data = data;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public String getReciever() {
		return reciever;
	}

	public void setReciever(String reciever) {
		this.reciever = reciever;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}
	

}
