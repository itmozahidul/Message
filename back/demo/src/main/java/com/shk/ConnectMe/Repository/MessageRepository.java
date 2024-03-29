package com.shk.ConnectMe.Repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.shk.ConnectMe.Model.Message;
import com.shk.ConnectMe.Model.User;

@Repository
public interface MessageRepository extends CrudRepository<Message, Long> {
	@Query(value="select * from message where (message.sender = ?1 and  message.reciever = ?2) or (message.sender = ?2 and  message.reciever = ?1)", nativeQuery = true)
	public List<Message> getMessagesByUser(long user1, long user2);
	
	@Query(value="select top ?3 * from message where (message.sender = ?1 and  message.reciever = ?2) or (message.sender = ?2 and  message.reciever = ?1) order by message.time DESC", nativeQuery = true)
	public List<Message> getlimitedMessagesByUser(long user1, long user2, int no);
	
	@Query(value="select count(id) from message where (message.sender = ?1 and  message.reciever = ?2) or (message.sender = ?2 and  message.reciever = ?1) and (message.seen = false) ", nativeQuery = true)
	public long getUnreadMsgNoOfTwoUsers(long user1, long user2);
	
	@Query(value="select* from (select * from (select * from message where message.chat=?1 and message.timemili>=?2 ) as t where not ( t.deleted=1 and  t.sender=?4)) as tt order by tt.timemili DESC limit ?3", nativeQuery = true)
	public  List<Message> getMessagesbyChatId(long chatid, long timemili,int limit, long senderid);
	
	@Query(value="select* from (select * from (select * from message where message.chat=?1 and message.timemili>=?2 ) as t where not ( t.deleted=1 and  t.sender=?3)) as tt order by tt.timemili DESC", nativeQuery = true)
	public  List<Message> getMessagesbyChatIdohneLimit(long chatid, long timemili, long senderid);
	
	@Query(value="select* from (select * from (select * from message where message.chat=?1 and message.timemili>=?2 ) as t where not ( t.deleted=1 and  t.sender=?4)) as tt order by tt.timemili DESC limit ?3 offset ?5", nativeQuery = true)
	public  List<Message> getMessagesbyChatIdoffset(long chatid, long timemili,int limit, long senderid,int offset);
	
	
	@Query(value="select count(*) from message where message.chat=?1 and message.seen = 0 and message.deleted=0 and message.reciever=?2", nativeQuery = true)
	public  int getNoOfUnreadMsgBychatid(long chatid, long sender);
	
	@Transactional
	@Modifying
	@Query(value="update message set message.seen = ?1 where message.id=?2", nativeQuery = true)
	public void UpdateMessage(boolean seen , long id); 
	
	@Transactional
	@Modifying
	@Query(value="update message set message.reciever = ?2 where message.id=?1", nativeQuery = true)
	public void UpdateRecieverByID(long id, String reciever ); 
	
	@Transactional
	@Modifying
	@Query(value="update message set message.sender = ?2 where message.id=?1", nativeQuery = true)
	public void UpdateSenderByID(long id, long sender ); 
	
	@Transactional
	@Modifying
	@Query(value="update message set message.deleted = ?2 where message.id=?1", nativeQuery = true)
	public void UpdatemsgdeletedBysender(long id , int value); 
	
	@Transactional
	@Modifying
	@Query(value="update message set message.seen = 1 where message.chat=?1 and (message.seen = 0) and message.reciever=?2", nativeQuery = true)
	public void UpdateallMessageseenforaUser(long chatid, long userid); 
	
	@Transactional
	@Modifying
	@Query(value="delete from message where message.chat=?1 ", nativeQuery = true)
	public void deleteMessagesByChatid(long chatid); 
	
	@Transactional
	@Modifying
	@Query(value="delete from message where message.id=?1 ", nativeQuery = true)
	public void deleteaMessageByid(long id); 
	
	

}
