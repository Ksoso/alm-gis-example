import React, {useEffect} from "react";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import {ListItemText, makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        position: 'absolute',
        top: '.5em',
        left: '.5em',
        width: '280px'
    }
});

const LayerListItem = ({layer}) => {
    const layerName = layer.get('name');
    const labelId = `layerl-label-${layer.ol_uid}`;

    const [selected, setSelected] = React.useState(layer.getVisible());
    useEffect(() => {
        layer.setVisible(selected);
    }, [layer, selected]);

    const handleSelectionChange = () => {
        setSelected(!layer.getVisible());
    };

    return <ListItem button dense onClick={handleSelectionChange}>
        <ListItemIcon>
            <Checkbox
                edge="start"
                checked={selected}
                tabIndex={-1}
                disableRipple
                inputProps={{'aria-labelledby': labelId}}
            />
        </ListItemIcon>
        <ListItemText id={labelId} primary={layerName}/>
    </ListItem>
};

export function LayerList({map}) {
    const classes = useStyles();

    const layersToRender = map.getLayers().getArray()
        .filter(l => l.get('layerList'));

    return (<Paper className={classes.root}>
        <List>
            {
                layersToRender.map((layer, i) => <LayerListItem key={i} layer={layer}/>)
            }
        </List>
    </Paper>)
}