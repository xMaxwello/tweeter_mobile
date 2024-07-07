import axios from 'axios';
import {apiConfig, apiUrl} from "./apiConfig";
import { Tweet } from "../types/userTweets.ts";

const fetchTweets = async (page: number):Promise<Tweet[] | null> => {
    if(page != null && page != 0){
        const res = await axios.get(`${apiUrl}/tweets?page=${page}`,apiConfig);
        if(res.status == 200){
            return res.data.data;
        }
    }
    return null;
}

const fetchMyTweets = async (page: number):Promise<Tweet[] | null> => {
    if(page != null && page != 0){
        const res = await axios.get(`${apiUrl}/home?page=${page}`,apiConfig);
        if(res.status == 200){
            return res.data.data;
        }
    }
    return null;
}

const fetchTweetDetails = async (id: number): Promise<Tweet | null> => {
    if(id != null) {
        const response = await axios.get(`${apiUrl}/tweets/${id}`, apiConfig);
        if (response.status === 200) {
            return response.data.data as Tweet;
        }
    }
    return null;
}

const postTweet = async (body: string,image: File | null):Promise<Tweet|null> => {
    const formData = new FormData();
    formData.append('body', body);
    if (image) {
        formData.append('image', image);
    }
    const res =
        await axios.post(`${apiUrl}/tweets`, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json'
            },
        });
    if(res.status === 201) {
        return res.data.data;
    }
    return null;
}

const postComment = async (id:number, body: String):Promise<Comment|null> => {
    const res = await axios.post(`${apiUrl}/tweets/${id}/comments`, {body},apiConfig)
    if(res.status == 201){
        return res.data.data;
    }
    return null;
}

const toggleLikeTweet = async (id:number):Promise<boolean|null> => {
    if(id != null){
        const res = await axios.post(`${apiUrl}/tweets/${id}/likes`,{},apiConfig)
        if(res.status == 200){
            return res.data.data;
        }
    }
    return null;
}

const toggleLikeComment = async (id:number):Promise<boolean|null> => {
    if(id != null){
        const res = await axios.post(`${apiUrl}/comments/${id}/likes`,{},apiConfig)
        if(res.status == 200){
            return res.data.data;
        }
    }
    return null;
}


export {
    fetchTweets,
    fetchMyTweets,
    fetchTweetDetails,
    postTweet,
    postComment,
    toggleLikeTweet,
    toggleLikeComment,
}