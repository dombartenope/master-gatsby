import { useContext, useState } from "react"
import OrderContext from '../components/OrderContext'
import attachNamesAndPrices from "./attachNamesAndPrices";
import calculateTotalOrder from "./calculateTotalOrder";

const usePizza = ({ pizzas, values }) => {
    //state to hold the order from context
    const [order, setOrder] = useContext(OrderContext);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    //function to add to order
    const addToOrder = (orderedPizza) => {
        setOrder([...order, orderedPizza]);
    }
    //function to remove from order
    const removeFromOrder = (index) => {
        setOrder([
            //before what we want to remove
            ...order.slice(0, index),
            //after what we want to remove
            ...order.slice(index + 1),
        ]);
    }

    const submitOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        // setMessage('Go EAT!');
        
        const body = {
            order: attachNamesAndPrices(order, pizzas),
            total: calculateTotalOrder(order, pizzas),
            name: values.name,
            email: values.email,
            mapleSyrup: values.mapleSyrup,
        }

        //send data to serverless function at checkout
        const res = await fetch(`${process.env.GATSBY_SERVERLESS_BASE}/placeOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const text = JSON.parse(await res.text());

        //Check if everything works
        if(res.status >= 400 && res.status < 600) {
            setLoading(false);
            setError(text.message);
        } else {
            setLoading(false);
            setMessage(`Success! Come on down for your pizza`)
        }
    }
    
    return {
        order,
        addToOrder,
        removeFromOrder,
        error,
        loading,
        message,
        submitOrder,
    };
}
    


export default usePizza
