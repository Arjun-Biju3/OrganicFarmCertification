import React, { useContext, useState } from 'react'
import './Auth.css'
import Card from '../../shared/components/UIElements/Card'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/FormHook'
import { AuthContext } from '../../shared/context/AuthContext'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import { useHttpClient } from '../../shared/hooks/http-hook'

function Auth() {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: "",
            isValid: false
        },
        password: {
            value: "",
            isValid: false
        }
    }, false)

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined,
            }, formState.inputs.email.isValid && formState.inputs.password.isValid
            );
        }
        else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: "",
                    isValid: false
                },
            }, false);
        }
        setIsLoginMode(prevMode => !prevMode);
    };

    const authSubmitHandler = async event => {
        event.preventDefault();
        console.log(formState.inputs);

        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    "https://organicfarmcertification.onrender.com/api/users/login",
                    "POST",
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value,
                    }),
                    {
                        "Content-Type": "application/json",
                    }
                );

                auth.login(responseData.userId, responseData.token, responseData.role);
            } catch (error) {
                // Handle error
            }
        } else {
            try {
                const responseData = await sendRequest(
                    "https://organicfarmcertification.onrender.com/api/users/signup",
                    "POST",
                    JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value,
                    }),
                    {
                        "Content-Type": "application/json",
                    }
                );
                auth.login(responseData.userId, responseData.token, responseData.role);


            } catch (error) {
                // Handle error
            }
        }
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <div className="auth-container">
                <Card className="authentication">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <h2>{isLoginMode ? "LOGIN" : "SIGNUP"}</h2>
                    <hr />
                    <form onSubmit={authSubmitHandler}>
                        {!isLoginMode &&
                            <Input id="name" element="input" type="text"
                                label="Your Name"
                                validators={[VALIDATOR_REQUIRE()]}
                                errorText="Please enter a name"
                                onInput={inputHandler}
                            />
                        }
                        <Input id="email" element="input" type="email"
                            label="Email"
                            validators={[VALIDATOR_EMAIL()]}
                            errorText="Please enter a valid email address"
                            onInput={inputHandler}
                        />

                        <Input id="password" element="input" type="password"
                            label="Password"
                            validators={[VALIDATOR_MINLENGTH(6)]}
                            errorText="Please enter a valid password, at least 6 characters."
                            onInput={inputHandler}
                        />
                        <Button type="submit" disabled={!formState.isValid}>{isLoginMode ? 'LOGIN' : 'SIGNUP'}</Button>
                    </form>
                    <Button inverse onClick={switchModeHandler} >SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>
                </Card>
            </div>
        </React.Fragment>
    )
}

export default Auth