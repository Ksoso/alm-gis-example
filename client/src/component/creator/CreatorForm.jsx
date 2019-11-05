import {DEFAULT_VALUE, objectConfig} from "./objectConfig";
import {FormField} from "./FormField";
import {makeStyles, MenuItem, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Cancel, Create} from "@material-ui/icons";
import React from "react";
import PropTypes from "prop-types";

const formStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 400
    },
    button: {
        width: '49%',
        margin: '2px'
    }
}));

export default function CreatorForm({formValues, geometry, onObjectTypeChange, onFormValueChange, onFormSubmit, onCancel}) {

    const classes = formStyles();
    const objectTypeDef = objectConfig[formValues['type']];

    let fields = [];
    let isValid = Boolean(geometry);
    if (objectTypeDef && DEFAULT_VALUE !== objectTypeDef.id) {
        fields = Object.entries(objectTypeDef.fields).map(([key, value]) => {
            if (value.required) {
                isValid = isValid && Boolean(formValues[key]);
            }
            return <FormField key={key} value={formValues[key]} fieldDef={value} fieldId={key}
                              onValueChange={onFormValueChange}/>
        });

        //geometry field
        fields.push(
            <TextField required={true} key={'geometry'} className={classes.textField} label={'Geometria'}
                       name={'geometry'} id={'geometry'} onChange={onFormValueChange} error={!geometry}
                       helperText={!geometry ? 'Pole Geometria jest wymagane' : ''}
                       margin={"normal"} value={geometry || ''} multiline={true} rowsMax={'4'} rows={'3'}
                       InputProps={{readOnly: true}}>
            </TextField>
        );
    }

    return (<form className={classes.root} noValidate autoComplete="off" onSubmit={onFormSubmit}>
        <TextField id="object-type" select label='Wybierz obiekt' name='type' className={classes.textField}
                   value={formValues['type']} onChange={onObjectTypeChange}
                   helperText="Proszę wybierz obiekt do stworzenia" margin={"normal"}>
            {Object.values(objectConfig).map(o => (<MenuItem key={o.id} value={o.id}>{o.label}</MenuItem>))}
        </TextField>
        {fields}
        <Button type={'submit'} color={"secondary"} variant={"contained"}
                disabled={!isValid || formValues['type'] === 'none'}
                className={classes.button} startIcon={<Create/>}>
            Zapisz obiekt
        </Button>
        <Button color={"secondary"} variant={"contained"} disabled={formValues['type'] === 'none'}
                className={classes.button} startIcon={<Cancel/>} onClick={onCancel}>
            Anuluj
        </Button>
    </form>)
}

CreatorForm.propTypes = {
    /**
     * Aktualny stan formularza
     */
    formValues: PropTypes.object.isRequired,
    /**
     * Wartość geoemtrii w formacie WKT
     */
    geometry: PropTypes.string,
    /**
     * Funkcja zostanie uruchomienia po zmianie typu obiektu
     */
    onObjectTypeChange: PropTypes.func,
    /**
     * Funkcja zostanie uruchomienia po zmianie wartości pola w formularzu
     */
    onFormValueChange: PropTypes.func,
    /**
     * Funkcja zostanie uruchomiona po wysłaniu formularzu
     */
    onFormSubmit: PropTypes.func,
    /**
     * Funkcja zostanie uruchomiona po anulowaniu procesu dodawania obiektu
     */
    onCancel: PropTypes.func,
};