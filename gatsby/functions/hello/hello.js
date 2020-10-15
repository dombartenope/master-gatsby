exports.handler = async (e, context) => {
    console.log(e)
    return {
        statusCode: 200,
        body: 'Hello!!'
    }
}