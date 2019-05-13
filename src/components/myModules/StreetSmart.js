import React, {Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../redux/reducers/map';
import {actions as graphicActions} from '../../redux/reducers/graphic'
import './StreetSmart.css'

const containerID = "StreetSmart-container";

class StreetSmart extends Component {

    componentDidMount() {

        this.startup(containerID);
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Tell React to never update this component, that's up to us
        return false;
    }
    ssCancel = () => {
        window
            .StreetSmartApi
            .destroy({
                targetElement: document.getElementById(containerID)
            });
        this
            .props
            .closeStreetSmartViewer();

    }

    startup = (divId) => {

        const x = this.props.graphic.ssInputGeom[0].x;
        const y = this.props.graphic.ssInputGeom[0].y;
        const geoJSONSelect = this.props.graphic.ssgeoJSONselPoint;
        const geoJSONNeighbors = this.props.graphic.ssOverlay;

        const PointsSLD = ' <?xml version="1.0"  encoding="ISO-8859-1"?><StyledLayerDescriptor  version="1.' +
                '0.0"             xsi:schemaLocation="http://www.opengis.net/sld  StyledLayerDesc' +
                'riptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net' +
                '/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/20' +
                '01/XMLSchema-instance"><NamedLayer><Name>Simple  point  with  stroke</Name><User' +
                'Style><Title>GeoServer  SLD  Cook  Book:  Simple  point  with  stroke</Title><Fe' +
                'atureTypeStyle><Rule><PointSymbolizer><Graphic><Mark><WellKnownName>circle</Well' +
                'KnownName><Fill><CssParameter  name="fill">#FF0000</CssParameter></Fill><Stroke>' +
                '<CssParameter  name="stroke">#000000</CssParameter><CssParameter  name="stroke-w' +
                'idth">2</CssParameter></Stroke></Mark><Size>6</Size></Graphic></PointSymbolizer>' +
                '</Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';

        const selectSLD = '<?xml version="1.0"  encoding="ISO-8859-1"?><StyledLayerDescriptor  version="1.0' +
                '.0"             xsi:schemaLocation="http://www.opengis.net/sld  StyledLayerDescr' +
                'iptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/' +
                'ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/200' +
                '1/XMLSchema-instance"><NamedLayer><Name>Simple  point  with  stroke</Name><UserS' +
                'tyle><Title>GeoServer  SLD  Cook  Book:  Simple  point  with  stroke</Title><Fea' +
                'tureTypeStyle><Rule><PointSymbolizer><Graphic><Mark><WellKnownName>circle</WellK' +
                'nownName><Fill><CssParameter  name="fill">#00000000</CssParameter><CssParameter ' +
                'name="fill-opacity">0.2</CssParameter></Fill><Stroke><CssParameter  name="stroke' +
                '">#E633FF</CssParameter><CssParameter  name="stroke-width">2</CssParameter></Str' +
                'oke></Mark><Size>12</Size></Graphic></PointSymbolizer></Rule></FeatureTypeStyle>' +
                '</UserStyle></NamedLayer></StyledLayerDescriptor>';

        const options = [
            {
                name: "Nearby Supports",
                geojson: geoJSONNeighbors,
                sldXMLtext: PointsSLD
            }, {
                name: "Selected Support",
                geojson: geoJSONSelect,
                sldXMLtext: selectSLD
            }
        ]

        window
            .StreetSmartApi
            .init({
                username: "signworks",
                password: "SIGNWORKS",
                apiKey: "CnkxOTY52fExizg9C_EVanMh2j0RK3gxuzURif89eLsZu3ghqTAt6LEdKng56fo1",
                targetElement: document.getElementById(containerID),
                srs: "EPSG:2248",
                locale: 'en-us',
                configurationUrl: 'https://atlas.cyclomedia.com/configuration',
                addressSettings: {
                    locale: "en",
                    database: "Nokia"
                }
            })
            .then(function () {
                var viewerType = window.StreetSmartApi.ViewerType.PANORAMA

                window
                    .StreetSmartApi
                    .open(x + "," + y, {
                        viewerType: viewerType,
                        srs: 'EPSG:2248'
                    })
                    .then(function (result) {
                        if (result) {

                            for (let i = 0; i < result.length; i++) {
                                if (result[i].getType() === window.StreetSmartApi.ViewerType.PANORAMA) {

                                    window.panoramaViewer = result[i];
                                }

                                //
                                // window.panoramaViewer.on(window.StreetSmartApi.Events.panoramaViewer.VIEW_CHA
                                // N GE, changeView);
                                // window.panoramaViewer.on(window.StreetSmartApi.Events.panoramaViewer.VIEW_LOA
                                // D _END, loadViewEnd);
                     
                              
                                for (let o in options) {
                                    window
                                        .StreetSmartApi
                                        .addOverlay(options[o])
                                } 

                            }

                        }
                    }.bind(this))
                    .catch(function (reason) {
                        alert('Failed to create component(s) through API: ' + reason)
                    });
            }, function (err) {
                alert('Api Init Failed!' + err);
            });

    }

    render() {

        return (
            <div className="StreetSmart">
                <div className="ssCancel" onClick={this.ssCancel}>X</div>
                <div ref="ssDiv" className="ssPane" id={containerID}></div>

            </div>
        )
    }
}
const mapStateToProps = state => ({map: state.map, graphic: state.graphic, config: state.config});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions,
        ...graphicActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StreetSmart);
