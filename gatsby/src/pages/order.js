import { graphql } from 'gatsby'
import React, { useState } from 'react'
import SEO from '../components/SEO'
import useForm from '../utils/useForm'
import Img from 'gatsby-image'
import calculatePizzaPrice from '../utils/calculatePizzaPrice'
import formatMoney from '../utils/formatMoney'
import OrderStyles from '../styles/OrderStyles'
import MenuItemStyles from '../styles/MenuItemsStyles'
import usePizza from '../utils/usePizza'
import PizzaOrder from '../components/PizzaOrder'
import calculateTotalOrder from '../utils/calculateTotalOrder'

const OrderPage = ({ data }) => {
    const pizzas = data.pizzas.nodes;

    const { values, updateValue } = useForm({
        name: '',
        email: '',
        mapleSyrup: '',
    })

    const {
        order, 
        addToOrder, 
        removeFromOrder,
        error,
        loading,
        message,
        submitOrder,
    } = usePizza({ pizzas, values, });

    if(message) {
        return <p>{message}</p>
    }

    return (
        <>
            <SEO title={`Order a Pizza!`}/>
            <OrderStyles onSubmit = {submitOrder}>
                <fieldset disabled={loading}>
                    <legend>Your Info</legend>

                    <label htmlFor="name">Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        id="name"
                        value = {values.name} 
                        onChange = {updateValue} 
                    /> 

                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        name="email"
                        id="email"
                        value = {values.email}
                        onChange = {updateValue} 
                    />                 
                    <input 
                        type="mapleSyrup" 
                        name="mapleSyrup"
                        id="mapleSyrup"
                        className="mapleSyrup"
                        value = {values.mapleSyrup}
                        onChange = {updateValue} 
                    />                 
                </fieldset>

                <fieldset className="menu" disabled={loading}>
                        <legend> Menu </legend>
                        {pizzas.map((pizza, i) => (
                            <MenuItemStyles key={i}>
                                
                                <Img width="50" height="50" fluid={pizza.image.asset.fluid} alt={pizza.name} />
                                
                                <div>
                                    <h2>{pizza.name}</h2>
                                </div>

                                <div>
                                    {['S', 'M', 'L'].map((size, i) => (
                                        <button key={i} type="button" onClick={() => addToOrder({
                                            id: pizza.id,
                                            size,
                                        })}>
                                            {size} - {formatMoney(calculatePizzaPrice(pizza.price, size))}
                                            
                                        </button>
                                    ))}
                                </div>
                            </MenuItemStyles>
                        ))}
                </fieldset>

                <fieldset className="order" disabled={loading}>
                    <legend>Order</legend>
                    <PizzaOrder 
                        order={order} 
                        removeFromOrder={removeFromOrder} 
                        pizzas={pizzas}
                    />
                </fieldset>
                <fieldset disabled={loading}>
                    <h3>Your total is {calculateTotalOrder(order, pizzas)}</h3>
                    <div>
                        {error ? <p style={{color: 'var(--red)'}}>Error: {error}</p> : ''}
                    </div>
                    <button type="sumbit" disabled={loading}>{loading ? 'Placing order...' : 'Order Ahead'}</button>
                </fieldset>
            </OrderStyles>
        </>
    )
}

export default OrderPage

export const query = graphql`
    query {
        pizzas: allSanityPizza {
            nodes {
                name
                id
                slug {
                    current
                }
                price
                image {
                    asset {
                        fluid(maxWidth: 100) {
                            ...GatsbySanityImageFluid
                        }
                    }
                }
            }
        }
    }
`;
