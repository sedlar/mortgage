import { TextFieldProps } from "@material-ui/core";
import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";

interface IntFieldProps {
    value: number;
    setValue: (value: number) => void;
}

function formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export default function FloatField({ value, setValue, ...props }: IntFieldProps & TextFieldProps) {
    const [privateValue, setPrivateValue] = useState<string>(formatNumber(value));
    const [error, setError] = useState<boolean>(false);
    return (
        <TextField
            value={privateValue}
            error={error}
            onChange={event => {
                const enteredValue = parseFloat(event.target.value.replaceAll(",", ""));
                setPrivateValue(formatNumber(enteredValue));
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
