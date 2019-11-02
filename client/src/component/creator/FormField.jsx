import React from "react";
import PropTypes from "prop-types";
import {FieldType} from "./objectConfig";
import {makeStyles, TextField} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles(theme => ({
    root: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 400
    },
}));

/**
 * Komponent odpowiadający za pojedyncze pole w formularzu
 */
export function FormField({fieldId, fieldDef, value, onValueChange}) {
    const classes = useStyles();
    const {label, required, type, readOnly, selectValues} = fieldDef;

    let isValid = true;
    if (fieldDef.required) {
        isValid = Boolean(value);
    }

    const textArea = FieldType.TEXT_AREA === type ? {multiline: true, rowsMax: '6', rows: '3'} : {};
    const readOnlyInput = readOnly ? {InputProps: {readOnly: true}} : {};
    const numberInput = FieldType.NUMBER === type ? {type: FieldType.NUMBER} : {};
    const selectInput = FieldType.SELECT === type ? {select: true} : {};
    const validation = !isValid ? {error: true, helperText: `Pole ${label} jest wymagane`} : {};

    const fieldVariationProps = {...textArea, ...readOnlyInput, ...numberInput, ...selectInput, ...validation};

    return <TextField required={required} className={classes.root} label={label} name={fieldId}
                      onChange={onValueChange} margin={"normal"} value={value || ''} {...fieldVariationProps}>
        {FieldType.SELECT === type && selectValues && selectValues.map(o => <MenuItem key={o.value}
                                                                                      value={o.value}>{o.label}</MenuItem>)}
    </TextField>
}

FormField.propTypes = {
    /**
     * identyfikator pola w ogólnym stanie formularza
     */
    fieldId: PropTypes.string.isRequired,
    /**
     * Definicja pola, które ma zostać wyrenderowane
     */
    fieldDef: PropTypes.shape({
        /**
         * Typ pola
         */
        type: PropTypes.oneOf([FieldType.SELECT, FieldType.NUMBER, FieldType.TEXT, FieldType.TEXT_AREA]).isRequired,
        /**
         * Czy wymagane
         */
        required: PropTypes.bool.isRequired,
        /**
         * Etykieta pola
         */
        label: PropTypes.string.isRequired,
        /**
         * Jeśli pole jest selekcją, przechowuje informacje o możliwych opcjach selekcji
         */
        selectValues: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        }))
    }),
};