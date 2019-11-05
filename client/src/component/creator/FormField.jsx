import React from "react";
import PropTypes from "prop-types";
import {FieldType} from "./objectConfig";
import {makeStyles, TextField} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

const formFieldStyles = makeStyles(theme => ({
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
    const classes = formFieldStyles();
    const {label, required, type, readOnly, selectValues} = fieldDef;

    //Sprawdzamy tylko czy pole jest wymagane
    let isValid = true;
    if (fieldDef.required) {
        isValid = Boolean(value);
    }

    //Ustawiamy właściwości, jeśli pole jest polem tekstowym (typ: textArea)
    const textArea = FieldType.TEXT_AREA === type ? {multiline: true, rowsMax: '6', rows: '3'} : {};
    //Ustawiamy właściwości, jeśli pole przyjmuję tylko wejście numeryczne
    const numberInput = FieldType.NUMBER === type ? {type: FieldType.NUMBER} : {};
    //Ustawiamy właściwości, jeśli pole jest selekcją
    const selectInput = FieldType.SELECT === type ? {select: true} : {};
    //Ustawiamy właściwości, jeśli wymagane jest wyświetlenie walidacji
    const validation = !isValid ? {error: true, helperText: `Pole ${label} jest wymagane`} : {};
    //Ustawiamy właściwości, jeśli pole jest tylko do odczytu
    const readOnlyInput = readOnly ? {InputProps: {readOnly: true}} : {};

    //Złączamy właściwości, które definiują wygląd pola formularza
    const fieldVariationProps = {...textArea, ...readOnlyInput, ...numberInput, ...selectInput, ...validation};

    return <TextField required={required} className={classes.root} label={label} name={fieldId} id={fieldId}
                      onChange={onValueChange} margin={"normal"} value={value || ''} {...fieldVariationProps}>
        {FieldType.SELECT === type && selectValues && selectValues.map(o => <MenuItem key={o.value}
                                                                                      value={o.value}>{o.label}</MenuItem>)}
    </TextField>
}

FormField.propTypes = {
    /**
     * identyfikator pola w ogólnym stanie formularza, zostanie ustawione
     * jako atrybut name i id
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