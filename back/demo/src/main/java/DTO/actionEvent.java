package DTO;

public class actionEvent {
	String time;
	String type;
	String from;
	String to;
	MessageResponse data;
	public actionEvent(String time, String type, String from, String to, MessageResponse data) {
		super();
		this.time = time;
		this.type = type;
		this.from = from;
		this.to = to;
		this.data = data;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getFrom() {
		return from;
	}
	public void setFrom(String from) {
		this.from = from;
	}
	public String getTo() {
		return to;
	}
	public void setTo(String to) {
		this.to = to;
	}
	public MessageResponse getMsgr() {
		return data;
	}
	public void setMsgr(MessageResponse data) {
		this.data = data;
	}
	
    
	

}
