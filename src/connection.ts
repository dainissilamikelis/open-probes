import * as WebSocket from 'ws';

class CPDWebSocketClient {
    private ws: WebSocket;
    private readyPromise: Promise<void>;
    private isReady: boolean = false;
    private idCounter: number = 0;
    private callbacks: Map<number, { resolve: (data: any) => void; reject: (err: any) => void }>;

    constructor(private url: string) {
        this.ws = new WebSocket(url);
        this.callbacks = new Map();
        this.readyPromise = new Promise((resolve, reject) => {
            this.ws.on('open', () => {
                console.log('WebSocket connection established.');
                this.isReady = true;
                resolve();
            });

            this.ws.on('error', (err) => {
                console.error('WebSocket error:', err.message);
                reject(err);
            });
        });

        // Handle incoming messages
        this.ws.on('message', (data) => this.handleMessage(data.toString()));

        this.ws.on('close', () => {
            console.log('WebSocket connection closed.');
        });
    }

    private handleMessage(data: string): void {
        const message = JSON.parse(data);
        if (message.id && this.callbacks.has(message.id)) {
            const { resolve, reject } = this.callbacks.get(message.id)!;
            this.callbacks.delete(message.id);

            if (message.error) {
                reject(message.error);
            } else {
                resolve(message.result);
            }
        } else {
            console.log('Event or unknown message:', message);
        }
    }

    async waitForConnection(): Promise<void> {
        if (!this.isReady) {
            await this.readyPromise;
        }
    }

    async sendCommand<T = unknown>(
        method: string,
        params?: Record<string, unknown>,
        timeout: number = 5000
    ): Promise<T> {
        await this.waitForConnection();

        const id = ++this.idCounter;
        const command = { id, method, params };

        return new Promise<T>((resolve, reject) => {
            // Store the callback for when the response arrives
            this.callbacks.set(id, { resolve, reject });

            // Send the command over WebSocket
            this.ws.send(JSON.stringify(command));

            // Set up a timeout to reject the promise if no response is received
            setTimeout(() => {
                if (this.callbacks.has(id)) {
                    this.callbacks.delete(id);
                    reject(new Error(`Command "${method}" timed out after ${timeout} ms`));
                }
            }, timeout);
        });
    }

    /**
     * Closes the WebSocket connection
     */
    close(): void {
        this.ws.close();
    }
}
export default CPDWebSocketClient;
