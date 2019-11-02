import React, {useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import {GeometryWizard} from "./creator/GeometryWizard";
import {LayerList} from "./LayerList";

const useStyles = makeStyles({
    root: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
    },
});

export const OlMap = ({id}) => {
    const classes = useStyles();
    const mapContainer = useRef(null);

    const [map, setMap] = useState(null);
    useEffect(() => {
        const osmLayer = new TileLayer({
            source: new XYZ({
                url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });

        osmLayer.setProperties({
            name: 'OpenStreetMap',
            layerList: true,
        });

        if (!map) {
            setMap(new Map({
                target: mapContainer.current,
                layers: [osmLayer],
                view: new View({
                    center: [0, 0],
                    zoom: 2
                })
            }))
        }
    }, [map]);

    return (
        <div id={id} className={classes.root} ref={mapContainer}>
            {map && <LayerList map={map}/>}
            {map && <GeometryWizard map={map}/>}
        </div>
    )

};

OlMap.prototypes = {
    id: PropTypes.string.isRequired
};