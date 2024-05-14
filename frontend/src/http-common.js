import axios from 'axios';

export default axios.create({
    baseURL: "http://devops-server:4000/api",
    headers: {
        "Content-Type": "application/json"
    }
});
