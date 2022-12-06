import {Field} from './Field';

export interface MastodonUser {
    id: string
    username: string
    acct: string
    display_name: string
    locked: boolean
    bot: boolean
    discoverable: boolean
    group: boolean
    created_at: string
    note: string
    url: string
    avatar: string
    avatar_static: string
    header: string
    header_static: string
    followers_count: number
    following_count: number
    statuses_count: number
    last_status_at: string
    noindex: boolean
    emojis: any[]
    fields: Field[]
  }