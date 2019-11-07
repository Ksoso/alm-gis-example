import React, {useEffect, useRef, useState} from "react";
import {makeStyles} from '@material-ui/core/styles'
import Map from 'ol/Map';
import View from 'ol/View';
import {Creator} from "./creator/Creator";
import {LayerList} from "./LayerList";
import {register} from "ol/proj/proj4";
import {get} from 'ol/proj';
import proj4 from 'proj4';
import VectorSource from "ol/source/Vector";
import {bbox} from "ol/loadingstrategy";
import VectorImageLayer from "ol/layer/VectorImage";
import Feature from "ol/Feature";
import WKT from "ol/format/WKT";
import {StyleFactory} from "../utils/StyleFactory";
import {LayerUtils} from "../utils/LayerUtils";
import Cluster from "ol/source/Cluster";

const wktFormat = new WKT();
const BASE_EXTENT = [144907.1658, 140544.7241, 877004.0070, 910679.6817];

/**
 * Definicja odwzorowania przestrzennego dla Polski
 */
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

/**
 * Tworzy instancję mapy OpenLayers 6.x
 *
 * @param htmlContainer obiekt HTML reprezentujący kontener, gdzie mapa ma zostać wyrenderowana
 * @return {Promise<Map>} promise, który zawiera obiekt mapy
 */
async function createOpenLayersMap(htmlContainer) {
    const EPSG2180 = get('EPSG:2180');
    EPSG2180.setExtent(BASE_EXTENT);

    const ortoWMTS = await LayerUtils.createWMTS('https://mapy.geoportal.gov.pl/wss/service/WMTS/guest/wmts/ORTO', {
        layer: 'ORTOFOTOMAPA',
        projection: 'EPSG:2180',
        matrixSet: 'EPSG:2180',
    }, {
        name: 'Ortofotomapa',
        layerList: true,
        visible: false
    });

    const bdoWMTS = await LayerUtils.createWMTS('https://mapy.geoportal.gov.pl/wss/service/WMTS/guest/wmts/G2_MOBILE_500', {
        layer: 'G2_MOBILE_500',
        projection: 'EPSG:2180',
        matrixSet: 'EPSG:2180',
    }, {
        name: 'Mapa podkładowa BDOO i BDOT10k',
        layerList: true,
        visible: true
    });

    const buildingsWMS = LayerUtils.createWMS('http://localhost:8080/geoserver/polsl_gis/wms', {
        format: "image/png8",
        tiled: true,
        layers: 'polsl_gis:building',
        tilesOrigin: `${BASE_EXTENT[0]},${BASE_EXTENT[1]}`
    }, {
        name: 'Budynki',
        type: 'building',
        layerList: true,
    });

    const roadsWMS = LayerUtils.createWMS('http://localhost:8080/geoserver/polsl_gis/wms', {
        format: "image/png8",
        tiled: true,
        layers: 'polsl_gis:road'
    }, {
        name: 'Drogi',
        type: 'road',
        layerList: true,
    });

    const poiVectorSource = new VectorSource({
        loader: async function (extent) {
            const url = new URL('http://localhost:3002/poi/bbox'),
                params = {xmin: extent[0], ymin: extent[1], xmax: extent[2], ymax: extent[3]};
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

            try {
                const response = await fetch(url);
                const poiResponse = await response.json();
                this.addFeatures(poiResponse.map(poi => {
                    const ft = new Feature({
                        geometry: wktFormat.readGeometry(poi.st_astext),
                        name: poi.name,
                        description: poi.description,
                        category: poi.category
                    });

                    ft.setId(poi.id);

                    return ft;
                }));
            } catch (e) {
                this.removeLoadedExtent(extent);
            }
        },
        strategy: bbox
    });

    const poiCluster = new Cluster({
        source: poiVectorSource,
    });

    const poiVectorLayer = new VectorImageLayer({
        source: poiCluster,
        style: StyleFactory.poiStyleCluster
    });

    poiVectorLayer.setProperties({
        name: 'Punkty zainteresowania',
        type: 'poi',
        layerList: true,
    });

    const wfsPoi = LayerUtils.createWFS('http://localhost:8080/geoserver/polsl_gis/wfs',
        {
            typeName: 'polsl_gis:poi',
            projection: 'EPSG:2180',
            style: StyleFactory.poiStyle
        }, {
            name: 'Punkty zainteresowania (WFS)',
            layerList: true,
            visible: false
        });

    return new Map({
        target: htmlContainer,
        layers: [ortoWMTS, bdoWMTS, buildingsWMS, roadsWMS, poiVectorLayer, wfsPoi],
        view: new View({
            center: [506717.070973, 264450.406505],
            projection: EPSG2180,
            zoom: 8,
        })
    });
}

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