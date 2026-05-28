import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL=process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';


export const api= axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config)=>{

        return config;
    },
    (error)=>Promise.reject(error)
);

api.interceptors.response.use(
    (response)=>response,
    (error)=>{
        const message = error.response?.data?.message || error.message || 'Something went wrong';
        toast.error(message);
        if(error.response?.status=== 404){
            toast.error("Resource Not found");
        }else if(error.response?.status === 401){
            toast.error('Unauthorized');
        }

        return Promise.reject(error);
    }
);

export default api;

