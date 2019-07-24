import React, {Component} from 'react'
import Sign from './Sign';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as mapActions} from '../../../redux/reducers/map';
import {layerURLs} from "../../../utils/JSAPI"
import { layer } from '@fortawesome/fontawesome-svg-core';

let editClicker = null
const SortableItem = SortableElement(({value, index, canEdit}) => <Sign sign={value} index = {index}
 canEdit={canEdit} editClick={editClicker}></Sign>);
const SortableList = SortableContainer(({items,canEdit}) => {

    return (
        <div>
            {items.map((value, index) => (<SortableItem key={`item-${index}`} canEdit={canEdit} index={index} value={value}/>))}
        </div>

    );
});

class Signs extends Component {

    onSortEnd = ({oldIndex, newIndex}) => {

        let newOrder = [...this.props.signs]

        newOrder = arrayMove(newOrder, oldIndex, newIndex)

        for (let i = 0; i < newOrder.length; i++) {

            newOrder[i].feature.attributes.SIGNORDER = i;

        }
       
        this
            .props
            .signOrderChanged(newOrder, this.props.map.support, layerURLs(this.props));
        /* */
    };

    render() {
        editClicker = this.props.editClick;
      

        if (this.props.signs) {

            return <SortableList
                items={this.props.signs}
                onSortEnd={this.onSortEnd}
                distance={10}
                canEdit={this.props.auth.isEditor}/>;
        } else 
            return <p></p>
    }
}

const mapStateToProps = state => ({map: state.map, config: state.config, auth:state.auth});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...mapActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Signs);