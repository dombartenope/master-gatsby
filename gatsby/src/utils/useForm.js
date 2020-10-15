import { useState } from 'react';

const useForm = (defaults) => {
    const [values, setValues] = useState(defaults);

    const updateValue = (e) => {
        let value = e.target.value;
        
        //check if value is a number
        if(e.target.type === 'number'){
            value = parseInt(value);
        }

        setValues({
            //existing values
            ...values,
            [e.target.name]: e.target.value,
        })
    }

    return {values, updateValue}
}

export default useForm;