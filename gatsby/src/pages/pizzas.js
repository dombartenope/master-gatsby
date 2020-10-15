import { graphql } from 'gatsby';
import React from 'react'
import PizzaList from '../components/PizzaList';
import ToppingsFilter from '../components/ToppingsFilter';
import SEO from '../components/SEO'

export const query =  graphql`
    query PizzaQuery($topping: [String]) {
        pizzas: allSanityPizza(filter: {
            toppings: {
                elemMatch: {
                    name: {
                        in: $topping
                    }
                }
            }
        }) {
            nodes {
                name
                id
                slug {
                    current
                }
                toppings {
                    id
                    name
                }
                image {
                    asset {
                        fluid(maxWidth: 400) {
                            ...GatsbySanityImageFluid
                        }
                    }
                }
            }
        }
    }
`;

const PizzasPage = ({ data, pageContext }) => {

    const pizzas = data.pizzas.nodes

    return (
        <>
            <SEO title={pageContext.topping ? `Pizzas with ${pageContext.topping}` : `All Pizzas`} />
            <ToppingsFilter activeTopping={pageContext.topping} />
            <PizzaList pizzas = {pizzas} />
        </>
    )
}

export default PizzasPage
