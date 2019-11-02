import React, {useEffect, useRef, useState} from "react";
import {makeStyles} from '@material-ui/core/styles'
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import {Creator} from "./creator/Creator";
import {LayerList} from "./LayerList";
import {register} from "ol/proj/proj4";
import {get} from 'ol/proj';
import proj4 from 'proj4';

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


const BASE_EXTENT = [144907.1658, 140544.7241, 877004.0070, 910679.6817];

proj4.defs('EPSG:2180', "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +axis=neu");
register(proj4);

export const OlMap = () => {
    const classes = useStyles();
    const mapContainer = useRef(null);

    const [map, setMap] = useState(null);
    useEffect(() => {
        const EPSG2180 = get('EPSG:2180');
        EPSG2180.setExtent(BASE_EXTENT);

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
                    zoom: 2,
                    projection: EPSG2180
                })
            }))
        }
    }, [map]);

    return (
        <div id={'map-visualization'} className={classes.root} ref={mapContainer}>
            {map && <LayerList map={map}/>}
            {map && <Creator map={map}/>}
        </div>
    )

};