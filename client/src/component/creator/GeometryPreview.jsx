import React, {useState} from "react";
import WKT from "ol/format/WKT";
import GeoJSON from "ol/format/GeoJSON";
import GML from "ol/format/GML";
import {makeStyles, MenuItem, Paper, TextField} from "@material-ui/core";

const styles = makeStyles(theme => ({
    root: {
        position: 'absolute',
        left: '.5em',
        bottom: '.5em',
        display: 'flex',
        flexWrap: 'wrap',
        width: 600,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '100%'
    },
}));

const wktFormat = new WKT();
const geoJsonFormat = new GeoJSON();
const gmlFormat = new GML();

const formats = [
    {
        label: 'Well Known Text (WKT)',
        value: 'wkt'
    },
    {
        label: 'Geography Markup Language (GML)',
        value: 'gml'
    },
    {
        label: 'GeoJSON',
        value: 'geoJSON'
    }
];

export default function GeometryPreview({geometry}) {
    const classes = styles();
    const [format, setFormat] = useState('wkt');

    let formattedGeometry = '';
    if (geometry) {
        if ('wkt' === format) {
            formattedGeometry = wktFormat.writeGeometry(geometry);
        } else if ('gml' === format) {
            formattedGeometry = gmlFormat.writeGeometry(geometry);
        } else if ('geoJSON' === format) {
            formattedGeometry = geoJsonFormat.writeGeometry(geometry);
        }
    }

    const handleFormatChange = (event) => {
        setFormat(event.target.value)
    };

    return (<Paper className={classes.root}>
        <TextField id="format" select label='Wybierz format' name='format' className={classes.textField}
                   value={format} onChange={handleFormatChange}
                   helperText="Proszę wybierz format tekstowy geometrii" margin={"normal"}>
            {formats.map(o => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}
        </TextField>
        <TextField variant={"filled"} className={classes.textField} name={'geometry'} disabled
                   label={'Geometria w formie tekstowej'}
                   margin={'normal'}
                   value={formattedGeometry || ''}
                   multiline={true} rowsMax={'3'}
                   rows={'3'}/>
    </Paper>)

}