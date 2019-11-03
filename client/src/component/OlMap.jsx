import React, {useEffect, useRef, useState} from "react";
import {makeStyles} from '@material-ui/core/styles'
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import {Creator} from "./creator/Creator";
import {LayerList} from "./LayerList";
import {register} from "ol/proj/proj4";
import {get} from 'ol/proj';
import proj4 from 'proj4';
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import WMTS, {optionsFromCapabilities} from "ol/source/WMTS";
import TileWMS from "ol/source/TileWMS";
import WMSServerType from "ol/source/WMSServerType";

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

const createWMTS = async (url, options, visible) => {
    const parser = new WMTSCapabilities();
    const response = await fetch(`${url}?SERVICE=WMTS&request=GetCapabilities`);
    const capabilities = await response.text();

    const optFromCapabilities = optionsFromCapabilities(parser.read(capabilities), options);

    return new TileLayer({
        opacity: 1,
        source: new WMTS(optFromCapabilities),
        visible
    });
};

const createWMS = (url, params) => {
    return new TileLayer({
        source: new TileWMS({
            url, params: params, serverType: WMSServerType.GEOSERVER, transition: 0
        })
    })
};

const createOpenLayersMap = async (htmlContainer) => {
    const EPSG2180 = get('EPSG:2180');
    EPSG2180.setExtent(BASE_EXTENT);

    const ortoWMTS = await createWMTS('https://mapy.geoportal.gov.pl/wss/service/WMTS/guest/wmts/ORTO', {
        layer: 'ORTOFOTOMAPA',
        projection: 'EPSG:2180',
        matrixSet: 'EPSG:2180',
        crossOrigin: ''
    }, false);

    ortoWMTS.setProperties({
        name: 'Ortofotomapa',
        layerList: true,
    });

    const bdoWMTS = await createWMTS('https://mapy.geoportal.gov.pl/wss/service/WMTS/guest/wmts/G2_MOBILE_500', {
        layer: 'G2_MOBILE_500',
        projection: 'EPSG:2180',
        matrixSet: 'EPSG:2180',
        crossOrigin: ''
    }, true);

    bdoWMTS.setProperties({
        name: 'Mapa podkładowa BDOO i BDOT10k',
        layerList: true,
    });

    const buildingsWMS = createWMS('http://localhost:8080/geoserver/polsl_gis/wms', {
        format: "image/png8",
        tiled: true,
        layers: 'polsl_gis:building'
    });

    buildingsWMS.setProperties({
        name: 'Budynki',
        type: 'building',
        layerList: true,
    });

    const roadsWMS = createWMS('http://localhost:8080/geoserver/polsl_gis/wms', {
        format: "image/png8",
        tiled: true,
        layers: 'polsl_gis:road'
    });

    roadsWMS.setProperties({
        name: 'Drogi',
        type: 'road',
        layerList: true,
    });


    return new Map({
        target: htmlContainer,
        layers: [ortoWMTS, bdoWMTS, buildingsWMS, roadsWMS],
        view: new View({
            center: [506717.070973, 264450.406505],
            projection: EPSG2180,
            zoom: 8,
        })
    });
};

export const OlMap = () => {
    const classes = useStyles();
    const mapContainer = useRef(null);

    const [map, setMap] = useState(null);
    useEffect(() => {
        if (!map) {
            async function createMap() {
                const newMap = await createOpenLayersMap(mapContainer.current);
                setMap(newMap);
            }

            createMap();
        }
    }, [map]);

    return (
        <div id={'map-visualization'} className={classes.root} ref={mapContainer}>
            {map && <LayerList map={map}/>}
            {map && <Creator map={map}/>}
        </div>
    )

};