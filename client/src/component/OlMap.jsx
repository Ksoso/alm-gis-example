import React, {useEffect, useRef, useState} from "react";
import {makeStyles} from '@material-ui/core/styles'
import {register} from "ol/proj/proj4";
import proj4 from 'proj4';
import WKT from "ol/format/WKT";

const wktFormat = new WKT();
const BASE_EXTENT = [144907.1658, 140544.7241, 877004.0070, 910679.6817];

proj4.defs('EPSG:2180', "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +axis=neu");
register(proj4);

const useStyles = makeStyles({
    root: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        '& .ol-zoom': {
            bottom: '.5em',
            left: 'auto',
            right: '.5em',
            top: 'auto'
        }
    },
});

async function createOpenLayersMap(htmlContainer) {
    //Tworzy instancje mapy
}

export const OlMap = () => {
    const classes = useStyles();
    //mapContainer.current zawiera aktualny element HTML podpięty pod REF
    const mapContainer = useRef(null);

    const [map, setMap] = useState(null);
    //Funkcja przekazana do useEffect nie może być asynchroniczna
    useEffect(() => {
        if (!map) {
            async function createMap() {
                //Tworzenie mapy i ustawianie stanu
            }

            createMap();
        }
    }, [map]);

    return (
        <div id={'map-visualization'} className={classes.root} ref={mapContainer}>
            <h1>Tutaj będzie mapa</h1>
            {/*{map && <LayerList map={map}/>}*/}
            {/*{map && <Creator map={map}/>}*/}
        </div>
    )
};