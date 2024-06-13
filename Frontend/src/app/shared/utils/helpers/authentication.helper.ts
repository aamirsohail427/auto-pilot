export class AuthenticationHelper {
    private static tokenKey = 'token';

    public static setToken(token): void {
        sessionStorage.setItem(this.tokenKey, token);
    }

    public static getToken(): string {
        return sessionStorage.getItem(this.tokenKey);
    }

    public static isAuthenticated(): boolean {
        const token = this.getToken();
        return token != null;
    }
}
