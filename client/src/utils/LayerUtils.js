import WMTSCapabilities from "ol/format/WMTSCapabilities";
import WMTS, {optionsFromCapabilities} from "ol/source/WMTS";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import {Vector as VectorSource} from "ol/source";
import Cluster from "ol/source/Cluster";
import VectorImageLayer from "ol/layer/VectorImage";
import GeoJSON from "ol/format/GeoJSON";
import {bbox} from "ol/loadingstrategy";

export const LayerUtils = {

    /**
     * Tworzy warstwę typu WMTS
     *
     * @param {string} url adres internetowy źródła
     * @param {object} wmtsParams parametry
     * @param {string} wmtsParams.layer identyfikator warstwy
     * @param {projection=} wmtsParams.projection nazwa systemu odniesienia przestrzennego np EPSG:2180 lub EPSG:4326
     * @param {matrixSet=} wmtsParams.matrixSet macierz serwisu WMTS, która ma zostać załadowana (Macierz definiuje
     * przedziały skalowe i dostępne zdjęcia na dany przedział skalowy)
     * @param {object} appOptions dodatkowe parametry wymagane przez aplikację
     * @param {string} appOptions.name nazwa warstwy wyświetlana w komponencie listy warstw
     * @param {boolean} appOptions.layerList jeśli <code>true</code> warstawa zostanie dodana do komponenetu listy warstw
     * @param {string=} appOptions.type nazwa typu, który odpowiada identyfikatorowi typu, który można dodawać z poziomu aplikacji
     * @param {boolean} visible jeśli <code>true</code> warstwa będzie domyślnie widoczna
     * @return {Promise<TileLayer>} instancję warstwy WMTS
     */
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

    /**
     * Tworzy warstwę WMS
     *
     * @param url url adres internetowy źródła
     * @param {object} wmsParams parametry usługi WMS
     * @param {string} wmsParams.layers identyfikator warstw do załadowania
     * @param {format=} wmsParams.format format zdjęcia, jaki ma być pobierany np: "image/png"
     * przedziały skalowe i dostępne zdjęcia na dany przedział skalowy)
     * @param {object} appOptions dodatkowe parametry wymagane przez aplikację
     * @param {string} appOptions.name nazwa warstwy wyświetlana w komponencie listy warstw
     * @param {boolean} appOptions.layerList jeśli <code>true</code> warstawa zostanie dodana do komponenetu listy warstw
     * @param {string=} appOptions.type nazwa typu, który odpowiada identyfikatorowi typu, który można dodawać z poziomu aplikacji
     * @return {TileLayer} instancję warstwy WMS
     */
    createWMS: (url, wmsParams, appOptions) => {
        const tileLayer = new TileLayer({
            source: new TileWMS({
                url, params: wmsParams
            })
        });

        tileLayer.setProperties(appOptions, true);
        return tileLayer;
    },

    createWFS: (url, wfsParams, appOptions) => {
        const wfsLayerSource = new VectorSource({
                format: new GeoJSON(),
                url: (extent) => `${url}?service=WFS&version=1.1.0\
                &request=GetFeature&typename=${wfsParams.typeName}\
                &outputFormat=application/json\
                &srsname=${wfsParams.projection}\
                &bbox=${extent.join(',')},${wfsParams.projection}'
                `,
                strategy: bbox
            }
        );

        const wfsLayer = new VectorImageLayer({
            source: wfsLayerSource,
            style: wfsParams.style
        });

        wfsLayer.setProperties(appOptions);
        return wfsLayer;
    },

    /**
     * Wymusze aktualizację wskazanej warstwy
     *
     * @param layers wszystkie warstwy w systemie pobrane przez map.getLayers()
     * @param type identyfikator typu danych, który pozwala połączyć typ danych z warstwą
     */
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