package com.shk.ConnectMe.WebSocket;

import java.security.Principal;

public class Puser implements Principal {
 
    private String name;
 
    public Puser(String name) {
        this.name = name;
    }
 
    @Override
    public String getName() {
        return name;
    }
 
}