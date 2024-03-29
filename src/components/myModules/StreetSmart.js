import React, {Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as mapActions} from '../../redux/reducers/map';
import {mapModes, actions as graphicActions} from '../../redux/reducers/graphic';
import {layerURLs} from '../../utils/JSAPI';
import './StreetSmart.css'

const containerID = "StreetSmart-container";

class StreetSmart extends Component {

    componentDidMount() {
        if (!window.StreetSmartApi.getApiReadyState()) {
            this.startup(containerID);
        } else {
            console.log('api already initialized');
            window
                .StreetSmartApi
                .destroy({
                    targetElement: document.getElementById(containerID)
                });
            this.startup(containerID);
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.graphic.ssInputGeom[0] != this.props.graphic.ssInputGeom[0]) {
            return true;
        } else {

            return false;
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.graphic.ssInputGeom[0] != this.props.graphic.ssInputGeom[0]) {;
            const msEvents = window.StreetSmartApi.Events.measurement;
            window
                .StreetSmartApi
                .off(msEvents.MEASUREMENT_CHANGED);
            window
                .panoramaViewer
                .off(window.StreetSmartApi.Events.panoramaViewer.VIEW_CHANGE)
                .off(window.StreetSmartApi.Events.panoramaViewer.VIEW_LOAD_END)
            window
                .StreetSmartApi
                .destroy({
                    targetElement: document.getElementById(containerID)
                });

            this.startup(containerID);
        }
    }

    ssCancel = () => {

        const msEvents = window.StreetSmartApi.Events.measurement;
        window
            .StreetSmartApi
            .off(msEvents.MEASUREMENT_CHANGED);
        window
            .panoramaViewer
            .off(window.StreetSmartApi.Events.panoramaViewer.VIEW_CHANGE)
            .off(window.StreetSmartApi.Events.panoramaViewer.VIEW_LOAD_END)
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
        const auth = this.props.auth;
        const coneCode = this.props.getNewCone;
        const editMode = this.props.graphic.editMode;
        const save = this.props.newSupport;
        const layers = layerURLs(this.props);
        const ciao = this.props.setMapClickMode;
        const bye = this.ssCancel;
        let imagePitch,
            imageYaw,
            imagehFov;

        const PointsSLD = ' <?xml version="1.0"  encoding="ISO-8859-1"?><StyledLayerDescriptor  version="1.' +
                '0.0"             xsi:schemaLocation="http://www.opengis.net/sld  StyledLayerDesc' +
                'riptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net' +
                '/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/20' +
                '01/XMLSchema-instance"><NamedLayer><Name>Simple  point  with  stroke</Name><User' +
                'Style><Title>GeoServer  SLD  Cook  Book:  Simple  point  with  stroke</Title><Fe' +
                'atureTypeStyle><Rule><PointSymbolizer><Graphic><Mark><WellKnownName>circle</Well' +
                'KnownName><Fill><CssParameter  name="fill">#FF0000</CssParameter></Fill><Stroke>' +
                '<CssParameter  name="stroke">#000000</CssParameter><CssParameter  name="stroke-w' +
                'idth">2</CssParameter></Stroke></Mark><Size>16</Size></Graphic></PointSymbolizer' +
                '></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';

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
                'oke></Mark><Size>19</Size></Graphic></PointSymbolizer></Rule></FeatureTypeStyle>' +
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
        const clkMap = function (evt) {

            let msEvents = window.StreetSmartApi.Events.measurement;

            let result = window
                .StreetSmartApi
                .getActiveMeasurement();
            if (result.features[0].geometry.coordinates == null) {
                return;
            }

            save(result, auth, layers);

            window
                .StreetSmartApi
                .off(msEvents.MEASUREMENT_CHANGED);

            ciao(mapModes.SELECT_SUPPORT_MODE, 'default');
            bye();

        };

        const surfaceCursorChangeHandler = (evt) => {}

        const changeView = function (evt) {
            // view cone stuff

            imagehFov = evt.detail.hFov;
            imagePitch = evt.detail.pitch;
            imageYaw = evt.detail.yaw;
            // for the last arg, I could pass in leftMode from props, but I think that
            // leftMode might go away in the future...
            coneCode(window.panoramaViewer._panoramaViewer._activeRecording.xyz, imagePitch, imageYaw, imagehFov, layers, "StreetSmart")

        };

        const loadViewEnd = function (evt) {

            window
                .panoramaViewer
                .rotateLeft(.01);
        if(editMode){
                window
                .panoramaViewer
                .toggleSidebarVisible(false);
        }
        
        };

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
                        srs: 'EPSG:2248',
                        panoramaViewer: {
                            closable: false,
                            replace: false
                        }

                    })
                    .then(function (result) {
                        if (result) {

                            for (let i = 0; i < result.length; i++) {
                                if (result[i].getType() === window.StreetSmartApi.ViewerType.PANORAMA) {

                                    window.panoramaViewer = result[i];
                                }
                                window
                                    .panoramaViewer
                                    .toggleNavbarExpanded(false);

                                if (editMode) {
                                    window
                                        .StreetSmartApi
                                        .startMeasurementMode(window.panoramaViewer, {geometry: window.StreetSmartApi.MeasurementGeometryType.POINT});
                                    let msEvents = window.StreetSmartApi.Events.measurement;
                                    window
                                        .StreetSmartApi
                                        .on(msEvents.MEASUREMENT_CHANGED, clkMap);

                                    window
                                        .panoramaViewer
                                        .toggleNavbarVisible(false);
                                }
                                window.panoramaViewer.closable = false;
                                window
                                    .panoramaViewer
                                    .on(window.StreetSmartApi.Events.panoramaViewer.VIEW_CHANGE, changeView);
                                window
                                    .panoramaViewer
                                    .on(window.StreetSmartApi.Events.panoramaViewer.VIEW_LOAD_END, loadViewEnd);
                                window
                                    .panoramaViewer
                                    .on(window.StreetSmartApi.Events.panoramaViewer.FEATURE_CLICK, surfaceCursorChangeHandler);

                                for (let o in options) {
                                    window
                                        .StreetSmartApi
                                        .addOverlay(options[o])
                                }

                            }

                        }
                    });
            }, function (err) {
                alert('Api Init Failed!' + err);
            });

    }

    render/* unto Caesar */() {return(
            <div className="StreetSmart">
                <div className="ssCancel" onClick={this.ssCancel}>X</div>
                <div ref="ssDiv" className="ssPane" id={containerID}></div>

            </div>
        )}
}
const mapStateToProps = state => ({map: state.map, graphic: state.graphic, auth: state.auth, config: state.config});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions,
        ...graphicActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StreetSmart);
