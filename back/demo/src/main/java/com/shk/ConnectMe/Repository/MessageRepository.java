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
	public List<Message> getMessagesByUser(int user1, int user2);
	
	@Transactional
	@Modifying
	@Query(value="update message set message.seen = ?1 where message.id=?2", nativeQuery = true)
	public void UpdateMessage(boolean seen , long id); 

}
