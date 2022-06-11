package DTO;

public class MessageResponse {
	    private String type;
	    private String time;
	    private String text;
	    private boolean seen;
	    private String sender;
	    private String reciever;
	public MessageResponse() {
		// TODO Auto-generated constructor stub
	}
	public MessageResponse(String time, String text, boolean seen, String sender, String reciever) {
		super();
		this.time = time;
		this.text = text;
		this.seen = seen;
		this.sender = sender;
		this.reciever = reciever;
		this.type = "message";
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
    
}
