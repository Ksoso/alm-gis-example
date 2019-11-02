import GeometryType from "ol/geom/GeometryType";

export const DEFAULT_VALUE = 'default';

export const FieldType = {
    TEXT: "text",
    TEXT_AREA: "textArea",
    NUMBER: "number"
};

export const objectConfig = {
    default: {
        id: DEFAULT_VALUE,
        label: 'Brak'
    },
    building: {
        id: 'building',
        label: 'Budynek',
        geometry: GeometryType.POLYGON,
        fields: {
            name: {
                type: FieldType.TEXT,
                required: true,
                label: 'Nazwa'
            },
            description: {
                type: FieldType.TEXT_AREA,
                required: true,
                label: 'Opis'
            }
        },
    },
    road: {
        id: 'road',
        label: 'Droga',
        geometry: GeometryType.LINE_STRING,
        fields: {
            name: {
                type: FieldType.TEXT,
                required: true,
                label: 'Nazwa'
            },
            description: {
                type: FieldType.TEXT_AREA,
                required: true,
                label: 'Opis'
            },
            length: {
                type: FieldType.NUMBER,
                required: false,
                label: 'Długość'
            }
        }
    },
    poi: {
        id: 'poi',
        label: "Punkt zainteresowania",
        geometry: GeometryType.POINT,
        fields: {
            name: {
                type: FieldType.TEXT,
                required: true,
                label: 'Nazwa'
            },
            description: {
                type: FieldType.TEXT_AREA,
                required: true,
                label: 'Opis'
            }
        },
    }
};