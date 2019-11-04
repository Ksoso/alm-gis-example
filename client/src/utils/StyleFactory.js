import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import HotelIcon from "../icon/hotel_2.png";
import CastleIcon from "../icon/castle.png";
import HospitalIcon from '../icon/hospital.png';
import RestaurantIcon from '../icon/restaurant.png';
import MuseumIcon from '../icon/museum.png';
import MonumentIcon from '../icon/monument.png';
import PoiIcon from '../icon/poi.png';

function createIcon(src, scale) {
    return new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src, scale
    })
}

export const StyleFactory = {
    hotelIcon: new Style({
        image: createIcon(HotelIcon, 0.4)
    }),
    castleIcon: new Style({
        image: createIcon(CastleIcon, 0.4)
    }),
    hospitalIcon: new Style({
        image: createIcon(HospitalIcon, 0.4)
    }),
    restaurantIcon: new Style({
        image: createIcon(RestaurantIcon, 0.4)
    }),
    museumIcon: new Style({
        image: createIcon(MuseumIcon, 0.4)
    }),
    monumentIcon: new Style({
        image: createIcon(MonumentIcon, 0.4)
    }),
    poiIcon: new Style({
        image: createIcon(PoiIcon, 0.4)
    })
};