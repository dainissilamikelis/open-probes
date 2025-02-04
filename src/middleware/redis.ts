import { createClient, RedisClientType  } from 'redis';

class RedisMiddleware {
    private client: RedisClientType;
    private connected: boolean = false;
    
    constructor(url :string) {
        this.client = createClient({ url });
        this.client.on('error', (err) => console.error('Redis Client Error:', err));
    }

    public async connect(): Promise<void> {
        if (!this.connected) {
          await this.client.connect();
          this.connected = true;
        }
      }
      
    public async disconnect(): Promise<void> {
        if (this.connected) {
            await this.client.disconnect();
            this.connected = false;
            console.log('Disconnected from Redis.');
        }
    }

    public async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    public async set(key: string, value: string, expiryInSeconds?: number): Promise<void> {
        if (expiryInSeconds) {
            await this.client.set(key, value, { EX: expiryInSeconds });
        } else {
            await this.client.set(key, value);
        }
    }
}

export default RedisMiddleware