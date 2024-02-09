# FROM is the first command to create the the first layer inside the image which is seeting up the node env for us.
#we can provide there specific version number there
#FROM [--platform=<platform>] <image>[:<tag>] [AS <name>]
FROM tomcat:8.5

COPY target/connect.war /usr/local/tomcat/webapps/connect.war

EXPOSE 8080

CMD ["/usr/local/tomcat/bin/catalina.sh", "run"]