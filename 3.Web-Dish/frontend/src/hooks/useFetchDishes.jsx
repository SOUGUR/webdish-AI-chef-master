import { useState, useEffect } from 'react';

const useFetchDishes = () => {
    const [loading, setLoading] = useState(true);
    const [dishes, setDishes] = useState([]);
    const [error, setError] = useState(null);
    const [recent, setRecent] = useState([])

    useEffect(()=>{
        const fetchRecent = async()=>{
            await fetch(`${import.meta.env.VITE_API_URL}/retrieve-history`,{
                method:"POST",
                headers:{
                  "Content-Type":"application/json",
                  "Access-Control-Allow-Origin": "*"
                },
                body:JSON.stringify({
                  chef:JSON.parse(localStorage.getItem("user")).user_id
            })}).then(async(e)=>{
                let json = await e.json()
                setRecent(json)
                console.log(json)
            })
        }
        fetchRecent()
    }, [])

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/dishes`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setDishes(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchDishes();
    }, []);

    return { loading, dishes, error, recent };
};

export default useFetchDishes;
