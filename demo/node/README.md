qwebirc-node
============
  
Qwebirc server using node and socket.io  
  
```
npm install  
node root
```
If run local navigate to 127.0.0.1:3000

I currently have an instance running for the gamesurge network at: http://qwebirc.herokuapp.com/
Note: heroku doesnt support websockets so its using xhr long polls :/

TODO:  
Currently doesn't support a true webirc server and just connects through the servers ip address.