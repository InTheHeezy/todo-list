import { useState } from "react";

export function Logon({
    onSetEmail = () => {},
    onSetToken = () => {}
}){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingOn, setIsLoggingOn] = useState(false);

}