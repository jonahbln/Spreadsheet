import React from 'react';
import { BackendButton } from '../interfaces/BackendButton';
import Button from '@mui/material/Button';


interface IButton {
    onPress(button: BackendButton): void;
    button: BackendButton;
    disabled: boolean
}

export function MenuButton(props: IButton) {
    return <Button color="inherit"
            disabled={props.disabled} 
            onClick={() => props.onPress(props.button)}>
                {props.button.getLabel()}
            </Button>
}