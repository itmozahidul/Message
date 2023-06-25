
package com.shk.ConnectMe.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.shk.ConnectMe.Controller.MessageController;

import DTO.FileResponse;

@Service
public class FileService {
	Logger log = LoggerFactory.getLogger(MessageController.class);
    @Value("${connectMe.data.upload.location}")
    private String uploadPath;
    @Value("${connectMe.data.download.location}")
    private String downloadPath;

    public  FileResponse save(MultipartFile file) throws Exception {
    	FileResponse f = new FileResponse();
    	
        try {
            Path root = Paths.get(uploadPath);
            Path fil = root.resolve(file.getOriginalFilename());
            if (fil.toFile()
                       .exists()) {
            	
            }else {
            	Resource resource = new UrlResource(fil.toUri());
            	String suffix = "";
            	
            		suffix = Long.toString(new Date().getTime());
            	
            	int lastIndexOfDot = file.getOriginalFilename().lastIndexOf('.');
            	String resultfile = file.getOriginalFilename().substring(0,lastIndexOfDot)+"_"+suffix+file.getOriginalFilename().substring(lastIndexOfDot);
            	Files.copy(file.getInputStream(),root.resolve(resultfile));
            	f =new FileResponse(downloadPath+"/"+resultfile);//new FileResponse( resource.getURL());
              
            }
            
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new Exception();
            
        }
        return f;
    }
}
