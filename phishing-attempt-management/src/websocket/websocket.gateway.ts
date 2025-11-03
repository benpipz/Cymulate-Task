import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

/**
 * WebSocket Gateway for real-time updates
 * Emits events when phishing attempts are created or clicked
 */
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/phishing-attempts',
})
export class PhishingAttemptsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(PhishingAttemptsGateway.name);

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
    this.logger.log(`WebSocket namespace: /phishing-attempts`);
    this.logger.log(`Server ready for connections`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // Send current attempts when client connects
    client.emit('connection', { status: 'connected' });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Emit event when a new phishing attempt is created
   */
  emitAttemptCreated(attempt: any) {
    this.logger.debug(`Emitting attempt:created for attempt: ${attempt._id}`);
    this.server.emit('attempt:created', {
      attempt: {
        id: attempt._id,
        targetMail: attempt.targetMail,
        targetHashcode: attempt.targetHashcode,
        status: attempt.status,
        createdAt: attempt.createdAt,
        updatedAt: attempt.updatedAt,
      },
    });
  }

  /**
   * Emit event when a phishing attempt is clicked
   */
  emitAttemptClicked(attempt: any) {
    this.logger.debug(`Emitting attempt:clicked for attempt: ${attempt._id}`);
    this.server.emit('attempt:clicked', {
      attempt: {
        id: attempt._id,
        targetMail: attempt.targetMail,
        targetHashcode: attempt.targetHashcode,
        status: attempt.status,
        createdAt: attempt.createdAt,
        updatedAt: attempt.updatedAt,
      },
    });
  }

  /**
   * Emit event when attempts list is updated
   */
  emitAttemptsUpdated(attempts: any[]) {
    this.logger.debug(`Emitting attempts:updated with ${attempts.length} attempts`);
    this.server.emit('attempts:updated', {
      attempts: attempts.map((attempt) => ({
        id: attempt._id || attempt.id,
        targetMail: attempt.targetMail,
        targetHashcode: attempt.targetHashcode,
        status: attempt.status,
        createdAt: attempt.createdAt,
        updatedAt: attempt.updatedAt,
      })),
    });
  }
}

