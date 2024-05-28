import React from "react";

interface ButtonPanelProps {
    buttonHandler: (code: string) => void;
};

const ButtonPanel: React.FC<ButtonPanelProps> = ({buttonHandler}) => {
    return(
    <div>
        <div>
            <button onClick={() => buttonHandler('1')}>1</button>
            <button onClick={() => buttonHandler('D')}>D</button>
        </div>
    </div>
    ); 
};

export default ButtonPanel;