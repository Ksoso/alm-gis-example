import WMTSCapabilities from "ol/format/WMTSCapabilities";
import WMTS, {optionsFromCapabilities} from "ol/source/WMTS";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import {Vector as VectorSource} from "ol/source";
import Cluster from "ol/source/Cluster";

export const LayerUtils = {

    createWMTS: async (url, wmtsParams, appOptions, visible) => {
        const parser = new WMTSCapabilities();
        const response = await fetch(`${url}?SERVICE=WMTS&request=GetCapabilities`);
        const capabilities = await response.text();

        const optFromCapabilities = optionsFromCapabilities(parser.read(capabilities), wmtsParams);

        const tileLayer = new TileLayer({
            source: new WMTS(optFromCapabilities),
            visible
        });

        tileLayer.setProperties(appOptions, true);
        return tileLayer;
    },

    createWMS: (url, wmsParams, appOptions) => {
        const tileLayer = new TileLayer({
            source: new TileWMS({
                url, params: wmsParams
            })
        });

        tileLayer.setProperties(appOptions, true);
        return tileLayer;
    },

    updateLayer: (layers, type) => {
        const layerToUpdate = layers.getArray().find(l => type === l.get('type'));
        if (layerToUpdate) {
            if (layerToUpdate.getSource() instanceof Cluster) {
                layerToUpdate.getSource().getSource().refresh();
            } else if (layerToUpdate.getSource() instanceof VectorSource) {
                layerToUpdate.getSource().refresh();
            } else {
                layerToUpdate.getSource().updateParams({'REVISION': new Date().toISOString()});
            }
        }
    }

};