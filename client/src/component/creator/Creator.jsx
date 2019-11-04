import React, {useEffect, useState} from "react"
import PropTypes from 'prop-types'
import Button from "@material-ui/core/Button";
import {makeStyles, MenuItem, TextField} from "@material-ui/core";
import {Cancel, Create} from "@material-ui/icons";
import Paper from "@material-ui/core/Paper";
import Draw from 'ol/interaction/Draw';
import {Vector as VectorLayer} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source';
import WKT from "ol/format/WKT";
import {unByKey} from "ol/Observable";
import {DEFAULT_VALUE, objectConfig} from "./objectConfig";
import {FormField} from "./FormField";
import {NotificationContentWrapper} from "../NotificationWrapper";
import Snackbar from "@material-ui/core/Snackbar";

const useStyles = makeStyles(theme => ({
    root: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        overflow: 'auto',
        maxHeight: '650px',
        width: '420px',
    },
    formContainer: {
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


const drawingSource = new VectorSource({wrapX: false});
const drawingLayer = new VectorLayer({
    source: drawingSource
});

const wktFormat = new WKT();
let drawEndListenerKey;

export function Creator({map}) {
    const classes = useStyles();
    const [formValues, setFormValues] = useState({'type': DEFAULT_VALUE});
    const [notification, setNotification] = useState({open: false, variant: 'success', msg: ''});

    useEffect(() => {
        map.addLayer(drawingLayer);
        return () => {
            map.removeLayer(drawingLayer);
        }
    }, [map]);

    const [interaction, setInteraction] = useState(null);
    const [geometry, setGeometry] = useState(null);
    useEffect(() => {
        if (interaction) {
            map.addInteraction(interaction);
            if (drawEndListenerKey) {
                unByKey(drawEndListenerKey);
            }
            drawEndListenerKey = interaction.on('drawend', (evt) => {
                setGeometry(wktFormat.writeFeature(evt.feature));
                interaction.setActive(false);
            });
        }

        return () => {
            if (interaction) {
                drawingSource.clear(true);
                map.removeInteraction(interaction);
                unByKey(drawEndListenerKey);
            }
        };
    }, [interaction, map]);

    const handleObjectTypeChange = (event) => {
        const actualType = formValues[event.target.name];
        const newType = event.target.value;
        const objectTypeDef = objectConfig[newType];

        if (actualType !== newType) {
            if (DEFAULT_VALUE !== newType) {
                const interaction = new Draw({
                    source: drawingSource,
                    type: objectTypeDef.geometry,
                    freehand: false
                });
                setInteraction(interaction);
            } else {
                setInteraction(null);
            }
            setGeometry(null);
            setFormValues({type: newType});
        }
    };

    const handleFormValueChange = (event) => {
        setFormValues({...formValues, [event.target.name]: event.target.value})
    };

    const handleAddObjectSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:3002/${formValues['type']}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'post',
                body: JSON.stringify({...formValues, geometry})
            });
            const content = await response.json();
            setNotification({
                variant: 'success',
                open: true,
                msg: `Zapis obiektu zakończył się powodzeniem, Id obiektu: ${content.id}`
            });

            const layerToUpdate = map.getLayers().getArray().find(l => l.get('type') === formValues['type']);
            if (layerToUpdate) {
                if (layerToUpdate.getSource() instanceof VectorSource) {
                    layerToUpdate.getSource().refresh();
                } else {
                    layerToUpdate.getSource().updateParams({'REVISION': new Date().toISOString()});
                }
            }

            clearForm();
        } catch (e) {
            console.error(e);
            setNotification({
                variant: 'error',
                open: true,
                msg: `Zapis obiektu zakończył się niepowodzeniem: ${e.message}`
            });
            clearForm();
        }
    };

    const handleCancelClick = () => {
        clearForm();
    };

    const clearForm = () => {
        setInteraction(null);
        setFormValues({type: DEFAULT_VALUE});
        setGeometry(null);
    };

    const renderWizard = () => {
        const objectTypeDef = objectConfig[formValues['type']];

        let fields = [];
        let isValid = Boolean(geometry);
        if (objectTypeDef && DEFAULT_VALUE !== objectTypeDef.id) {
            fields = Object.entries(objectTypeDef.fields).map(([key, value]) => {
                if (value.required) {
                    isValid = isValid && Boolean(formValues[key]);
                }
                return <FormField key={key} value={formValues[key]} fieldDef={value} fieldId={key}
                                  onValueChange={handleFormValueChange}/>
            });

            //geometry field
            fields.push(
                <TextField required={true} key={'geometry'} className={classes.textField} label={'Geometria'}
                           name={'geometry'} id={'geometry'} onChange={handleFormValueChange} error={!geometry}
                           helperText={!geometry ? 'Pole Geometria jest wymagane' : ''}
                           margin={"normal"} value={geometry || ''} multiline={true} rowsMax={'4'} rows={'3'}
                           InputProps={{readOnly: true}}>
                </TextField>
            );
        }

        return <form className={classes.formContainer} noValidate autoComplete="off" onSubmit={handleAddObjectSubmit}>
            <TextField id="object-type" select label='Wybierz obiekt' name='type' className={classes.textField}
                       value={formValues['type']} onChange={handleObjectTypeChange}
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
                    className={classes.button} startIcon={<Cancel/>} onClick={handleCancelClick}>
                Anuluj
            </Button>
        </form>
    };

    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setNotification({...notification, open: false});
    };

    return (
        <div className={classes.root}>
            <Paper>{renderWizard()}</Paper>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleNotificationClose}
            >
                <NotificationContentWrapper
                    onClose={handleNotificationClose}
                    variant={notification.variant}
                    message={notification.msg}
                />
            </Snackbar>
        </div>
    )
}

Creator.propTypes = {
    map: PropTypes.object.isRequired
};