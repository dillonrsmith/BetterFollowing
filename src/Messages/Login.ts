export interface LoginRequest {
    type: 'LoginRequest';
    url: string;
}

export function IsLoginRequest(obj: any) : obj is LoginRequest {
    return 'type' in obj && obj.type == 'LoginRequest'
}

export interface LoginResponse {
    type: 'LoginResponse';
    loggedIn: boolean;
}

export interface LogoutRequest {
    type: 'LogoutRequest';
}

export function IsLogoutRequest(obj: any): obj is LogoutRequest{
    return 'type' in obj && obj.type == 'LogoutRequest';
}