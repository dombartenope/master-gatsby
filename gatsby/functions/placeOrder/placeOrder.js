const nodemailer = require('nodemailer');

const generateOrderEmail = ({order, total}) => {
    return `
        <div>
            <h2>Your recent order for ${total}</h2>
            <p>Please start walking over, we will have your order ready in the next 20 minutes</p>
            <ul>
                ${order.map(item => 
                    `<li>
                        <img src="${item.thumbnail}" alt="${item.name}" />
                        ${item.size} ${item.name} - ${item.price}
                    </li>`
                ).join('')}
            </ul>
            <p>Your total is <strong>${total}</strong> due at pickup</p>
            <style>
                ul {
                    list-style: none;
                }
            </style>
        </div>
    `;
}

//Transporter
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
});

const wait = (ms = 0) => {
    return new Promise((res, rej) => {
        setTimeout(res, ms);
    })
}

//Test email
exports.handler = async(e, context) => {
    await wait(5000);
    const body = JSON.parse(e.body);
    console.log(body)

    //Check if honeypot is filled
    if(body.mapleSyrup) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Boop beep bop zzzst goodbye ERR#34234'}),
        }
    }

    //validate email data
    if(!body.order.length){
        return {
            statusCode: 400,
            body: JSON.stringify({ message: `You have to order something!`})
        }
    }
        

    //send email
    //send success/error message
    const info = await transporter.sendMail({
        from: "Slicks Slices <slick@example.com>",
        to: `${body.name} <${body.email}>, <order@example.com>`,
        subject: "New Order!",
        html: generateOrderEmail({ order: body.order, total: body.total })
    })

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Success' }),
    }
}