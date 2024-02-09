# FROM is the first command to create the the first layer inside the image which is seeting up the node env for us.
#we can provide there specific version number there
#FROM [--platform=<platform>] <image>[:<tag>] [AS <name>]
FROM node:16.17.0 as build

#We can define the work directory for the docker application. With this we can always use the relative path 
# signe like COPY . .  this means dot will always redirect to the WORKDIR given path
WORKDIR /app

#This command recievs two arguements. we use spae to separate them. The first one is the location of the files 
#which needs to be copied and seceond one is for the destination 
COPY . .

# Ionic needs to be installed globally
RUN npm install -g @ionic/cli

# WIth RUN command we can execute certain batch command (like the way we would do it in normal terminal) 
RUN npm install

COPY . .

RUN ionic build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/www/ /usr/share/nginx/html/

EXPOSE 8100



#This special command CMD is used to execute commands while the containers of the image will be started not 
#when the image is started. In our case we dont want our programm to start when we create our image. Programm 
#should be started once we start the container. The following command CMD ["node","app.js"] would look like "node app.js" in our
# usual terminal.
#CMD ["ionic","serve"]