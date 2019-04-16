import React from 'react';
import AdminModalService from '../../services/AdminModalService';


class ConfirmationModal {
  static show(heading, body) {
    return new Promise((resolve, reject) => {
      AdminModalService.showModalContent((
        <div className="admin-modal confirmation-dialog-size">
          <div className="header">
            {heading}
          </div>
          <div className="body">
            {body}  <br />
            <div className="confirmation-dialog-buttons">
              <button className="csa-button accent confirmation-button" onClick={resolve}>Yes</button>
              <button className="csa-button confirmation-button" onClick={reject}>Cancel</button>
            </div>
          </div>
        </div>
      ));
    });
  }
}
export default ConfirmationModal;
