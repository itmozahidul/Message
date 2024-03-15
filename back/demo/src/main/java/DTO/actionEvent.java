package DTO;

public class actionEvent {
	String time;
	long timemili;
	String type;
	String from;
	String to;
	MessageResponse data;
	public actionEvent(String time,long timemili, String type, String from, String to, MessageResponse data) {
		super();
		this.time = time;
		this.timemili=timemili;
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
	public long getTimemili() {
		return timemili;
	}
	public void setTimemili(long timemili) {
		this.timemili = timemili;
	}
	public MessageResponse getData() {
		return data;
	}
	public void setData(MessageResponse data) {
		this.data = data;
	}
	
    
	

}
