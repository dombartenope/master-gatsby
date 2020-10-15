const formatter = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

const formatMoney = (cents) => {
    return formatter.format(cents / 100);
}

export default formatMoney;