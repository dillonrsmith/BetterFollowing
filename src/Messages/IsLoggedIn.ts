export interface IsLoggedInRequest {
    type: 'IsLoggedInRequest';
}

export function IsLoggedInRequestMessage(obj: any): obj is IsLoggedInRequest {
    return 'type' in obj && obj.type == 'IsLoggedInRequest';
}

export interface IsLoggedInResponse{
    type: 'IsLoggedInResponse';
    loggedIn: boolean;
}

export function IsLoggedInResponseMessage(obj: any): obj is IsLoggedInResponse {
    return 'type' in obj && obj.type == 'IsLoggedInResponse';
}