<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
                       xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
                       xmlns="http://www.opengis.net/sld"
                       xmlns:ogc="http://www.opengis.net/ogc"
                       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <NamedLayer>
        <Name>Road</Name>
        <UserStyle>
            <Title>Style for roads</Title>
            <FeatureTypeStyle>
                <Rule>
                    <Name>autostrada</Name>
                    <Title>Autostrada</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>category</ogc:PropertyName>
                            <ogc:Literal>autostrada</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <LineSymbolizer>
                        <Stroke>
                            <GraphicStroke>
                                <Graphic>
                                    <Mark>
                                        <WellKnownName>wkt://MULTILINESTRING((-0.25 -0.25, -0.125 -0.25), (0.125 -0.25,
                                            0.25 -0.25), (-0.25 0.25, -0.125 0.25), (0.125 0.25, 0.25 0.25))
                                        </WellKnownName>
                                        <Fill>
                                            <CssParameter name="fill">#0000ff</CssParameter>
                                        </Fill>
                                        <Stroke>
                                            <CssParameter name="stroke">#0000ff</CssParameter>
                                            <CssParameter name="stroke-width">1</CssParameter>
                                        </Stroke>
                                    </Mark>
                                    <Size>6</Size>
                                </Graphic>
                            </GraphicStroke>
                        </Stroke>
                    </LineSymbolizer>
                </Rule>
                <Rule>
                    <Name>ekspresowa</Name>
                    <Title>Ekspresowa</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>category</ogc:PropertyName>
                            <ogc:Literal>ekspresowa</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <LineSymbolizer>
                        <Stroke>
                            <CssParameter name="stroke">#0000FF</CssParameter>
                            <CssParameter name="stroke-width">1</CssParameter>
                            <CssParameter name="stroke-dasharray">10 10</CssParameter>
                        </Stroke>
                    </LineSymbolizer>
                    <LineSymbolizer>
                        <Stroke>
                            <GraphicStroke>
                                <Graphic>
                                    <Mark>
                                        <WellKnownName>circle</WellKnownName>
                                        <Stroke>
                                            <CssParameter name="stroke">#000033</CssParameter>
                                            <CssParameter name="stroke-width">1</CssParameter>
                                        </Stroke>
                                    </Mark>
                                    <Size>5</Size>
                                </Graphic>
                            </GraphicStroke>
                            <CssParameter name="stroke-dasharray">5 15</CssParameter>
                            <CssParameter name="stroke-dashoffset">7.5</CssParameter>
                        </Stroke>
                    </LineSymbolizer>
                </Rule>
                <Rule>
                    <Name>glowna</Name>
                    <Title>Glowna</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>category</ogc:PropertyName>
                            <ogc:Literal>glowna</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <LineSymbolizer>
                        <Stroke>
                            <GraphicStroke>
                                <Graphic>
                                    <Mark>
                                        <WellKnownName>circle</WellKnownName>
                                        <Fill>
                                            <CssParameter name="fill">#666666</CssParameter>
                                        </Fill>
                                        <Stroke>
                                            <CssParameter name="stroke">#333333</CssParameter>
                                            <CssParameter name="stroke-width">1</CssParameter>
                                        </Stroke>
                                    </Mark>
                                    <Size>4</Size>
                                </Graphic>
                            </GraphicStroke>
                            <CssParameter name="stroke-dasharray">4 6</CssParameter>
                        </Stroke>
                    </LineSymbolizer>
                </Rule>
                <Rule>
                    <Name>zbiorcza</Name>
                    <Title>Zbiorcza</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>category</ogc:PropertyName>
                            <ogc:Literal>zbiorcza</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <LineSymbolizer>
                        <Stroke>
                            <CssParameter name="stroke">#0000FF</CssParameter>
                            <CssParameter name="stroke-width">3</CssParameter>
                            <CssParameter name="stroke-dasharray">5 2</CssParameter>
                        </Stroke>
                    </LineSymbolizer>
                </Rule>
                <Rule>
                    <Name>lokalna</Name>
                    <Title>Lokalna</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>category</ogc:PropertyName>
                            <ogc:Literal>lokalna</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <LineSymbolizer>
                        <Stroke>
                            <CssParameter name="stroke">#000000</CssParameter>
                            <CssParameter name="stroke-width">3</CssParameter>
                        </Stroke>
                    </LineSymbolizer>
                </Rule>
                <Rule>
                    <Name>dojazdowa</Name>
                    <Title>Dojazdowa</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>category</ogc:PropertyName>
                            <ogc:Literal>dojazdowa</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <LineSymbolizer>
                        <Stroke>
                            <CssParameter name="stroke">#FF0000</CssParameter>
                        </Stroke>
                    </LineSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
</StyledLayerDescriptor>