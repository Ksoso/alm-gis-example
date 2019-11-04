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
import VectorSource from "ol/source/Vector";
import {bbox} from "ol/loadingstrategy";
import VectorImageLayer from "ol/layer/VectorImage";
import Feature from "ol/Feature";
import WKT from "ol/format/WKT";
import {StyleFactory} from "../utils/StyleFactory";

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

const wktFormat = new WKT();

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

    const poiVectorSource = new VectorSource({
        loader: async (extent) => {
            const url = new URL('http://localhost:3002/poi/bbox'),
                params = {xmin: extent[0], ymin: extent[1], xmax: extent[2], ymax: extent[3]};
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

            const response = await fetch(url);
            const poiResponse = await response.json();
            poiVectorSource.addFeatures(poiResponse.map(poi => new Feature({
                geometry: wktFormat.readGeometry(poi.st_astext),
                name: poi.name,
                description: poi.description,
                category: poi.category
            })));
        },
        strategy: bbox
    });

    const poiVectorLayer = new VectorImageLayer({
        imageRatio: 2,
        source: poiVectorSource,
        style: (feature) => {
            const category = feature.get('category');

            switch (category) {
                case 'hotel':
                    return StyleFactory.hotelIcon;
                case 'zamek':
                    return StyleFactory.castleIcon;
                case 'pomnik':
                    return StyleFactory.monumentIcon;
                case 'szpital':
                    return StyleFactory.hospitalIcon;
                case 'restauracja':
                    return StyleFactory.restaurantIcon;
                case 'muzeum':
                    return StyleFactory.museumIcon;
                default:
                    return StyleFactory.poiIcon;
            }
        }
    });

    poiVectorLayer.setProperties({
        name: 'Punkty zainteresowania',
        type: 'poi',
        layerList: true,
    });

    return new Map({
        target: htmlContainer,
        layers: [ortoWMTS, bdoWMTS, buildingsWMS, roadsWMS, poiVectorLayer],
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