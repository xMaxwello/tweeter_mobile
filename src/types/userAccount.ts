interface UserAccount {
    id: number;
    full_name: string;
    avatar_url: string;
    is_following?: boolean;
}

export type { UserAccount };