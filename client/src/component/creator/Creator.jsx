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
import GeometryPreview from "./GeometryPreview";

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

/**
 * Tworzy interakcję rysowania na podstawie typu
 *
 * @param {string} type typ geometrii, która ma być rysowana
 * @return {{interaction: *, drawingLayer: *}} obiekt zawierający interakcję oraz warstwę wektorową, na
 * której dana interakcja ma operować
 */
function createDrawInteraction(type) {
    //Tworzymy interakcje rysowania na podstawie typu
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
                setGeometry(evt.feature.getGeometry());
                setTimeout(() => {
                    interaction.setActive(false);
                }, 200);
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

        //Zmiana typu
    };

    const handleFormValueChange = (event) => {
        setFormValues({...formValues, [event.target.name]: event.target.value})
    };

    const handleAddObjectSubmit = async (event) => {
        event.preventDefault();
        //Zapis obiektu
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

    const isDrawing = formValues['type'] !== DEFAULT_VALUE;

    return (
        <React.Fragment>
            <div className={classes.root}>
                <Paper>
                    <CreatorForm formValues={formValues} onCancel={handleCancelClick}
                                 onFormSubmit={handleAddObjectSubmit} onFormValueChange={handleFormValueChange}
                                 onObjectTypeChange={handleObjectTypeChange} geometry={geometry}/>
                </Paper>

                {!geometry && isDrawing && <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    open={true}
                >
                    <NotificationContentWrapper
                        variant={'warning'}
                        message={'Proszę o wyrysowanie geometrii, w celu kontunowania zapisu'}
                    />
                </Snackbar>}

                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
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
            <GeometryPreview geometry={geometry}/>
        </React.Fragment>
    )
}

Creator.propTypes = {
    map: PropTypes.object.isRequired
};