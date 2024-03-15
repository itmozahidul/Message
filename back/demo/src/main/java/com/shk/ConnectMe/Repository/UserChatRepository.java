package com.shk.ConnectMe.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.shk.ConnectMe.Model.User;
import com.shk.ConnectMe.Model.UserChat;

@Repository
public interface UserChatRepository  extends CrudRepository<UserChat, Long> {

	@Query(value="select * from user_chat where userid = ?1 and chatid=?2", nativeQuery = true)
	public UserChat getUserChatByuserandchatid(long userid, long chatid);
	@Query(value="select * from user_chat where chatid=?1", nativeQuery = true)
	public UserChat getUsersInUserChatBychatid( long chatid);
	@Transactional
	@Modifying
	@Query(value="update user_chat set user_chat.msglimit = ?1 where user_chat.userid=?2 and user_chat.chatid=?3", nativeQuery = true)
	public void UpdateUserChatLimitEntry(long limit, long userid, long chatid); 
	@Transactional
	@Modifying
	@Query(value="update user_chat set user_chat.blocked = ?1 where user_chat.userid=?2 and user_chat.chatid=?3", nativeQuery = true)
	public void UpdateUserChatBlockedEntry(int blocked, long userid, long chatid); 
}
