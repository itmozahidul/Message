package com.shk.ConnectMe.Repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.shk.ConnectMe.Model.Message;
import com.shk.ConnectMe.Model.User;

@Repository
public interface MessageRepository extends CrudRepository<Message, Long> {
	@Query(value="select * from message where message.sender = ?1 or message.reciever = ?1", nativeQuery = true)
	public List<Message> getMessagesByUser(int key);

}
