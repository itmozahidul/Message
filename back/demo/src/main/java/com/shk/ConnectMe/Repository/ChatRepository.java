package com.shk.ConnectMe.Repository;



import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import com.shk.ConnectMe.Model.Chat;
import com.shk.ConnectMe.Model.User;

public interface ChatRepository extends CrudRepository<Chat, Long> {
	@Query(value="select * from Chat where  Chat.id = ?1", nativeQuery = true)
	public Chat getChateadById(long chatid);
	
	@Query(value="select * from Chat where exists (select * from user_chat where user_chat.userid=?1 and user_chat.chatid= Chat.id ) ", nativeQuery = true)
	public List<Chat> getallChateadforauser(long userid);
	
	@Query(value="select * from user_chat where exists (select * from (select id from Chat where exists (select * from user_chat where user_chat.userid=?1 and user_chat.chatid= Chat.id )) as a where a.id=user_chat.chatid) and user_chat.userid=?2    ", nativeQuery = true)
	public List<Chat> doesChatwithUseridexists (long mainuserid, long searchwithuserid);
	
	@Query(value=" select * from Chat where Chat.name=?1 or Chat.name=?2 ", nativeQuery = true)
	public List<Chat> doesChatwithNameexists (String name, String namev);
	
	@Query(value=" select userid from user_chat where chatid=?1 ", nativeQuery = true)
	public int[] getusersinchat (long chatid);
	
	@Transactional
	@Modifying
	@Query(value="update chat set chat.unread_message_no = ?1 where chat.id=?2", nativeQuery = true)
	public void UpdateunreadMessageNoOfAChat(int unreadMesssageNo, long chatid); 
	
	@Transactional
	@Modifying
	@Query(value="delete from user_chat where chatid=?1 and userid=?2", nativeQuery = true)
	public void deleteuserfromauserchatrelation(long chatid, long userid); 
}
