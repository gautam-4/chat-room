import { Server } from "socket.io";

class SocketService{
    private _io: Server;
    constructor() {
        console.log('init SocketService');
        this._io = new Server();
    }

    public initListeners(){
        const io = this._io;
        console.log('init socket listeners');
        
        io.on('connection', (socket)=>{
            console.log('new socket connection', socket.id);

            socket.on('event:message', async ({message}: {message: string}) => 
                console.log('new message from socket', message)); 
        });

    }

    get io(){
        return this._io;
    }
}

export default SocketService;