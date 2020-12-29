import { TextFieldProps } from "@material-ui/core";
import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";

interface IntFieldProps {
    value: number;
    setValue: (value: number) => void;
}

export default function IntField({ value, setValue, ...props }: IntFieldProps & TextFieldProps) {
    const [privateValue, setPrivateValue] = useState<string>(value.toString());
    const [error, setError] = useState<boolean>(false);
    return (
        <TextField
            value={privateValue}
            error={error}
            onChange={event => {
                setPrivateValue(event.target.value);
                const enteredValue = parseInt(event.target.value);
                if (!isNaN(enteredValue)) {
                    setError(false);
                    setValue(enteredValue);
                } else {
                    setError(true);
                }
            }}
            helperText={error ? "Not a number" : null}
            {...props}
        />
    );
}
