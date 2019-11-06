import WMTSCapabilities from "ol/format/WMTSCapabilities";
import WMTS, {optionsFromCapabilities} from "ol/source/WMTS";
import TileLayer from "ol/layer/Tile";
import TileWMS from "ol/source/TileWMS";
import {Vector as VectorSource} from "ol/source";
import Cluster from "ol/source/Cluster";

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
        //Tworzenie warstwy WMTS
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
        //Tworzenie warstwy WMS
    },

    createWFS: (url, wfsParams, appOptions) => {
        //Tworzenie warstwy WFS
    },

    updateLayer: (layers, type) => {
        //Aktualizacja warstwy
    }

};