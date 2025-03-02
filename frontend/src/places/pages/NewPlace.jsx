import React, { useCallback, useReducer } from 'react';
import './PlaceForm.css';
import Input from '../../shared/components/FormElements/Input';
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from '../../shared/util/validators'
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/FormHook';



function NewPlace() {
 const [formState,inputHandler] =  useForm({
      title: {
        value:'',
        isValid:false
      },
    description: {
      value:'',
      isValid:false
    },
    address: {
      value:'',
      isValid:false
    }
    },
  false
  )

const placeSubmitHandler = event =>{
  event.preventDefault();
  console.log(formState.inputs);
  
}
  return (
    <form onSubmit={placeSubmitHandler} className='place-form'>
      <Input 
        id="title"
        element='input' 
        type='text' 
        label='Title' 
        validators={[VALIDATOR_REQUIRE()]} 
        onInput={inputHandler} 
        errorText="Please enter a valid title"
      />
      <Input 
        id="description"
        element='textarea'  
        label='Description' 
        validators={[VALIDATOR_MINLENGTH(5)]} 
        onInput={inputHandler} 
        errorText="Please enter a valid description"
      />
      <Input 
        id="address"
        element='input'  
        label='Address' 
        validators={[VALIDATOR_REQUIRE()]} 
        onInput={inputHandler} 
        errorText="Please enter a valid address"
      />
      <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
    </form>
  );
}

export default NewPlace;
