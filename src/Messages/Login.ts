export interface LoginRequest {
    type: 'LoginRequest';
    username: string;
    password: string; 
}

export interface LoginResponse {
    type: 'LoginResponse';
    loggedin: boolean;
}