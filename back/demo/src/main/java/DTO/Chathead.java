package DTO;

import java.util.List;

import com.shk.ConnectMe.Model.Message;

public class Chathead {
	private long id;
	private String unreadMessageNo;
	private String createTime;
	private String name;
	private List<MessageResponse>  rsp;
	public String getUnreadMessageNo() {
		return unreadMessageNo;
	}
	public void setUnreadMessageNo(String unreadMessageNo) {
		this.unreadMessageNo = unreadMessageNo;
	}
	public List<MessageResponse> getRsp() {
		return rsp;
	}
	public void setRsp(List<MessageResponse> rsp) {
		this.rsp = rsp;
	}
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Chathead(String unreadMessageNo, String createTime, String name, List<MessageResponse> rsp) {
		super();
		this.unreadMessageNo = unreadMessageNo;
		this.createTime = createTime;
		this.name = name;
		this.rsp = rsp;
	}
	public Chathead(long id, String unreadMessageNo, String createTime, String name, List<MessageResponse> rsp) {
		super();
		this.unreadMessageNo = unreadMessageNo;
		this.createTime = createTime;
		this.name = name;
		this.rsp = rsp;
		this.id=id;
	}
	
	
	
    
}
