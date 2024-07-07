export class authError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthError';
    }
}