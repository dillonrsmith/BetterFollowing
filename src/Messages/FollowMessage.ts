import { MastodonUser } from "../Models/MastodonUser";

export interface FollowMessage{
    id: string;
    follow: boolean;
    type: 'FollowMessage';
}

export function IsFollowMessage(obj: any): obj is FollowMessage {
    return 'type' in obj && obj.type == 'FollowMessage';
}

export interface GetFollowingMessage{
    type: 'GetFollowingMessage'
}

export function IsGetFollowingMessage(obj: any): obj is GetFollowingMessage {
    return 'type' in obj && obj.type == 'GetFollowingMessage';
}

export interface GetFollowingResponse{
    type: 'GetFollowingResponse';
    following: MastodonUser[]
}

export function IsGetFollowingResponse(obj: any): obj is GetFollowingResponse {
    return 'type' in obj && obj.type == 'GetFollowingResponse';
}