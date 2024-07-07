interface Tweet{
    id: number;
    body: string;
    image_url: string | null;
    user: User;
    is_liked: boolean;
    likes_count: number;
    comments_count: number;
    comments: Comment[];
    created_at: string;
}

interface User {
    id: number;
    full_name: string;
    avatar_url: string | null;
}

interface Comment {
    id: number;
    body: string;
    user: User;
    is_liked: boolean;
    likes_count: number;
    created_at: string;
}

export type { Tweet };