package DTO;

public class MessageResponse {
	private long id;
	    private String time;
	    private long timemili;
	    private int deleted;
	    private String text;
	    private boolean seen;
	    private String sender;
	    private String reciever;
	    private String data;
	    private String type;
	    private String chatid;
	public MessageResponse() {
		// TODO Auto-generated constructor stub
	}
	public MessageResponse(long id, String time,long timemili,int deleted, String text, boolean seen, String sender, String reciever) {
		super();
		this.id = id;
		this.time = time;
		this.timemili = timemili;
		this.text = text;
		this.seen = seen;
		this.sender = sender;
		this.reciever = reciever;
		this.deleted= deleted;
	}
	
	public MessageResponse(long id, String time,long timemili,int deleted, String text, boolean seen, String sender, String reciever, String type, String data) {
		super();
		this.id = id;
		this.time = time;
		this.timemili = timemili;
		this.text = text;
		this.seen = seen;
		this.sender = sender;
		this.reciever = reciever;
		this.type = type;
		this.data = data;
		this.chatid="";
		this.deleted=deleted;
	}
	
	public MessageResponse(long id, String time,long timemili,int deleted, String text, boolean seen, String sender, String reciever, String type, String data, String chatid) {
		super();
		this.id = id;
		this.time = time;
		this.timemili = timemili;
		this.text = text;
		this.seen = seen;
		this.sender = sender;
		this.reciever = reciever;
		this.type = type;
		this.data = data;
		this.chatid= chatid;
		this.deleted= deleted;
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
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
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
	public String getChatid() {
		return chatid;
	}
	public void setChatid(String chatid) {
		this.chatid = chatid;
	}
	public long getTimemili() {
		return timemili;
	}
	public void setTimemili(long timemili) {
		this.timemili = timemili;
	}
	public int getDeleted() {
		return deleted;
	}
	public void setDeleted(int deleted) {
		this.deleted = deleted;
	}
	
    
}
