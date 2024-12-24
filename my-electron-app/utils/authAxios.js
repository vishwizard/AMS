import axios from "axios";
import { useSelector } from "react-redux";

const token = useSelector((state) => state.token);

const authAxios = axios.create({
    baseURL:"http://localhost:5000",
    headers:{
        "Authorization": `Bearer ${token}`
    }
})

export default authAxios;