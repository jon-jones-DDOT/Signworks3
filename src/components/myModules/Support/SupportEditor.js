import React, {Component} from 'react'
import './SupportEditor.css'
import ModalWrapper from '../Modals/ModalWrapper';

export default class SupportEditor extends Component {

constructor(props) {
  super(props)

  this.state = {
     editedSupport : {...this.props.support}
  }
}


    saveClickHandler = () => {
        this
            .props
            .modalClicked(false, null)
        this
            .props
            .saveSupport(this.state.editedSupport, this.props.config.featureURLs)

    }

    cancelClickHandler = () => {
        this
            .props
            .modalClicked(false, null)
    }

    render() {
      
        return (

            <ModalWrapper
                {...this.props}
                title="Edit Support"
                width
                ={400}
                showOk={this.props.showOk}>
                <div className="SupportEditor">
                    <p>
                        I am the Editor Pane.
                    </p>
                    <p>{this.state.editedSupport.attributes.OBJECTID}</p>
                    <button onClick={this.cancelClickHandler}>CANCEL</button>
                    <button onClick={this.saveClickHandler}>SAVE</button>

                </div>
            </ModalWrapper>
        )
    }
}
