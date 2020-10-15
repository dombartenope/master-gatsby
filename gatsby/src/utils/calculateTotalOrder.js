import calculatePizzaPrice from "./calculatePizzaPrice"
import formatMoney from "./formatMoney";

const calculateTotalOrder = (order, pizzas) => {
    const total = order.reduce((runningTotal, singleOrder) => {
        const pizza = pizzas.find((singlePizza) => singlePizza.id === singleOrder.id);
        return runningTotal + calculatePizzaPrice(pizza.price, singleOrder.size);
    }, 0)
    return formatMoney(total);
}

export default calculateTotalOrder;