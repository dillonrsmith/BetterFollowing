export interface FollowMessage{
    id: string;
    follow: boolean;
    type: 'FollowMessage';
}

export function IsFollowMessage(obj: any): obj is FollowMessage {
    return 'type' in obj && obj.type == 'FollowMessage';
}