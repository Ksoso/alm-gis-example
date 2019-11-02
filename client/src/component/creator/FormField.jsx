import React from "react";
import {FieldType} from "./objectConfig";
import {makeStyles, TextField} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 400
    },
}));

export function FormField({fieldId, fieldDef, value, onValueChange}) {
    const classes = useStyles();
    const {label, required, type, readOnly} = fieldDef;

    let isValid = true;
    if (fieldDef.required) {
        isValid = fieldDef.required && Boolean(value);
    }

    const textArea = FieldType.TEXT_AREA === type ? {multiline: true, rowsMax: '6', rows: '3'} : {};
    const readOnlyInput = readOnly ? {InputProps: {readOnly: true}} : {};
    const numberInput = FieldType.NUMBER === type ? {type: FieldType.NUMBER} : {};
    const validation = !isValid ? {error: true, helperText: `Pole ${label} jest wymagane`} : {};

    const fieldVariationProps = {...textArea, ...readOnlyInput, ...numberInput, ...validation};

    return <TextField required={required} className={classes.root} label={label} name={fieldId}
                      onChange={onValueChange} margin={"normal"} value={value || ''} {...fieldVariationProps}/>
}