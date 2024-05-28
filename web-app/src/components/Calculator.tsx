import React from "react";
import { useState } from "react";
import { calculate, State } from "../logic/calculate";
import Panel from "./Panel";
import ButtonPanel from "./ButtonPanel";


const Calculator: React.FC = () => {
    const [state, setState] = useState<State>({
        current:"0",
        operand: 0,
        operator: null,
        isNextClear: false,
    });
    const buttonHandler = (code:string) => {
        const nextState = calculate(code, state);
        setState(nextState);
    }
    return(
    <div>
        <Panel />
        <ButtonPanel buttonHandler={buttonHandler} />
    </div>
    )
}

export default Calculator;