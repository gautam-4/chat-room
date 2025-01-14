import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

interface Message {
  id: string;
  content: string;
  createdAt: Date;
}

class SocketService {
  private _io: Server;
  private prisma: PrismaClient;
  private messages: Message[] = [];

  constructor() {
    console.log('Init SocketService');
    this._io = new Server({
      cors: {
        allowedHeaders: ['*'],
        origin: '*'
      }
    });
    this.prisma = new PrismaClient();
    this.loadMessages(); // Load initial messages
  }

  private async loadMessages() {
    try {
      const historicalMessages = await this.prisma.message.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' }
      });
      this.messages = historicalMessages.reverse();
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }

  public initListeners() {
    const io = this._io;
    console.log('Init socket listeners');

    io.on('connection', (socket) => {
      console.log('New socket connection', socket.id);
      
      // Send message history to new client
      socket.emit('event:messages', this.messages);

      socket.on('event:message', async ({ message }: { message: string }) => {
        try {
          // Save to database
          const newMessage = await this.prisma.message.create({
            data: {
              content: message,
            }
          });

          // Add to in-memory cache
          this.messages.push(newMessage);
          if (this.messages.length > 100) this.messages.shift();

          // Broadcast to all clients
          io.emit('event:newMessage', newMessage);
          
        } catch (error) {
          console.error('Failed to handle message:', error);
          socket.emit('event:error', 'Failed to send message');
        }
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;