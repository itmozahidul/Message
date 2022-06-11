package com.shk.ConnectMe.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.shk.ConnectMe.Model.Geheim;

@Repository
public interface GeheimRepository extends CrudRepository<Geheim, Long>{

}
