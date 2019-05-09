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
    ssCancel = () =>{
        window.StreetSmartApi.destroy({
            targetElement: document.getElementById(containerID)
        });
        this.props.closeStreetSmartViewer();

    }

    startup = (divId) => {
        const x = this.props.graphic.ssInputGeom[0].x;
        const y = this.props.graphic.ssInputGeom[0].y;

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

                                /*     for (o in options) {
                                    window.StreetSmartApi.addOverlay(options[o])
                                }
*/

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
                <div className="ssCancel" onClick={this.ssCancel} >X</div>
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
