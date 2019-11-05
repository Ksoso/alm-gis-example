import React, {useEffect, useState} from "react"
import PropTypes from 'prop-types'
import {makeStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Draw from 'ol/interaction/Draw';
import {Vector as VectorLayer} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source';
import WKT from "ol/format/WKT";
import {unByKey} from "ol/Observable";
import {DEFAULT_VALUE, objectConfig} from "./objectConfig";
import {NotificationContentWrapper} from "../NotificationWrapper";
import Snackbar from "@material-ui/core/Snackbar";
import CreatorForm from "./CreatorForm";
import {LayerUtils} from "../../utils/LayerUtils";

const useStyles = makeStyles({
    root: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        overflow: 'auto',
        maxHeight: '650px',
        width: '420px',
    },
});

const wktFormat = new WKT();

const emptyDrawingState = {
    interaction: null,
    drawingLayer: null
};

function createDrawInteraction(type) {
    const drawingSource = new VectorSource({wrapX: false});
    const drawingLayer = new VectorLayer({
        source: drawingSource
    });

    const interaction = new Draw({
        source: drawingSource,
        type: type,
        freehand: false
    });

    return {drawingLayer, interaction}
}

export function Creator({map}) {
    const classes = useStyles();
    const [formValues, setFormValues] = useState({'type': DEFAULT_VALUE});
    const [notification, setNotification] = useState({open: false, variant: 'success', msg: ''});

    const [drawingState, setDrawingState] = useState({...emptyDrawingState});
    const [geometry, setGeometry] = useState(null);
    useEffect(() => {
        let drawEndListenerKey = null;
        if (drawingState.interaction && drawingState.drawingLayer) {
            const {interaction, drawingLayer} = drawingState;
            map.addLayer(drawingLayer);
            map.addInteraction(interaction);

            drawEndListenerKey = interaction.on('drawend', (evt) => {
                setGeometry(wktFormat.writeFeature(evt.feature));
                interaction.setActive(false);
            });
        }

        return () => {
            if (drawingState.interaction && drawingState.drawingLayer) {
                if (drawEndListenerKey) {
                    unByKey(drawEndListenerKey);
                }
                map.removeInteraction(drawingState.interaction);
                map.removeLayer(drawingState.drawingLayer);
            }
        };
    }, [drawingState, map]);

    const handleObjectTypeChange = (event) => {
        const actualType = formValues[event.target.name];
        const newType = event.target.value;
        const objectTypeDef = objectConfig[newType];

        if (actualType !== newType) {
            if (DEFAULT_VALUE !== newType) {
                setDrawingState(createDrawInteraction(objectTypeDef.geometry));
            } else {
                setDrawingState({...emptyDrawingState});
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
        const actualType = formValues['type'];
        try {
            const response = await fetch(`http://localhost:3002/${actualType}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'post',
                body: JSON.stringify({...formValues, geometry})
            });
            const content = await response.json();
            LayerUtils.updateLayer(map.getLayers(), actualType);
            clearForm({
                variant: 'success',
                open: true,
                msg: `Zapis obiektu zakończył się powodzeniem, Id obiektu: ${content.id}`
            });
        } catch (e) {
            console.error(e);
            clearForm({
                variant: 'error',
                open: true,
                msg: `Zapis obiektu zakończył się niepowodzeniem: ${e.message}`
            });
        }
    };

    const handleCancelClick = () => {
        clearForm();
    };

    const clearForm = (notificationOpts) => {
        setDrawingState({...emptyDrawingState});
        setFormValues({type: DEFAULT_VALUE});
        setGeometry(null);
        if (notificationOpts) {
            setNotification(notificationOpts);
        }
    };

    const handleNotificationClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setNotification({...notification, open: false});
    };

    return (
        <div className={classes.root}>
            <Paper>
                <CreatorForm formValues={formValues} onCancel={handleCancelClick}
                             onFormSubmit={handleAddObjectSubmit} onFormValueChange={handleFormValueChange}
                             onObjectTypeChange={handleObjectTypeChange} geometry={geometry}/>
            </Paper>

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