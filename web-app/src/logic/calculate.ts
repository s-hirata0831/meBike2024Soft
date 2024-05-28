

export const calculate = (button: string, state: State):State => {
    if (isNumberButton(button)){
       
    }
    
    return state;
}
  
export interface State{
    current: string;
    operand: number;
    operator: string | null;
    isNextClear: boolean;
}

const isNumberButton = (button: string) => {
    return button === "0"
}



