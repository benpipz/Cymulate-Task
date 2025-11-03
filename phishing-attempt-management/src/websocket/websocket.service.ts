import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { PhishingAttemptsGateway } from './websocket.gateway';

/**
 * Service for watching MongoDB changes and emitting WebSocket events
 * Uses MongoDB Change Streams to detect new/updated phishing attempts
 */
@Injectable()
export class WebSocketService implements OnModuleInit {
  private readonly logger = new Logger(WebSocketService.name);

  constructor(
    @InjectConnection() private connection: Connection,
    private gateway: PhishingAttemptsGateway,
  ) {}

  /**
   * Initialize MongoDB change streams to watch for new/updated attempts
   */
  onModuleInit() {
    this.setupChangeStream();
  }

  private setupChangeStream() {
    try {
      const collection = this.connection.collection('phishingtargets');

      const changeStream = collection.watch(
        [
          {
            $match: {
              $or: [
                { operationType: 'insert' },
                { operationType: 'update' },
                { operationType: 'replace' },
              ],
            },
          },
        ],
        { fullDocument: 'updateLookup' },
      );

      changeStream.on('change', (change) => {
        this.logger.debug(`Change stream event: ${change.operationType}`);

        if (change.operationType === 'insert') {
          // New attempt created
          const document = change.fullDocument;
          if (document) {
            this.logger.log(
              `New phishing attempt created: ${document._id}`,
            );
            this.gateway.emitAttemptCreated(document);
          }
        } else if (change.operationType === 'update' || change.operationType === 'replace') {
          // Attempt updated (e.g., clicked)
          const document = change.fullDocument || change.documentKey;
          if (document) {
            // Get the full document to ensure we have all fields
            collection
              .findOne({ _id: document._id || change.documentKey._id })
              .then((fullDoc) => {
                if (fullDoc) {
                  this.logger.debug(
                    `Phishing attempt updated: ${fullDoc._id}`,
                  );
                  // Only emit if status changed to clicked (avoid duplicate emissions)
                  if (change.operationType === 'update') {
                    const updateChange = change as any;
                    if (
                      updateChange.updateDescription?.updatedFields?.status === 'clicked'
                    ) {
                      this.gateway.emitAttemptClicked(fullDoc);
                    }
                  } else if (fullDoc.status === 'clicked') {
                    // For replace operations, check if status is clicked
                    this.gateway.emitAttemptClicked(fullDoc);
                  }
                }
              })
              .catch((error) => {
                this.logger.error(
                  'Error fetching document after change stream update',
                  error,
                );
              });
          }
        }
      });

      changeStream.on('error', (error) => {
        this.logger.error('Change stream error:', error);
      });

      this.logger.log('MongoDB Change Stream initialized for phishing attempts');
    } catch (error) {
      this.logger.error('Failed to setup change stream:', error);
    }
  }
}

