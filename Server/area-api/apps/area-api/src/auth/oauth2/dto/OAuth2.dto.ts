

export interface OAuth2Interface {
    getUserInfo(authData: any): Promise<any>;
    getAccessToken(param: any, param1: any): Promise<any>;
    getLoginUrl(): Promise<any>;
    getAuthUrl(param: any): Promise<any>;
}