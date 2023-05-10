import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import fetchAllRecordsOfSelectedObject from '@salesforce/apex/sObjectController.fetchAllRecordsOfSelectedObject';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class RecordFetchGrandchild extends NavigationMixin(LightningElement) {

    @track lstFields = [];
    @track objectList = [];
    @api objectName = '';     
    @api arrayToSend = [];
    @track allRecordsOfSelectedObject = [];
    @track columnsMap=[];
    @track tempName=[];

    @track actions = 
    [
        { label: 'Edit', name: 'edit' },
        { label: 'View', name: 'view' },
        { label: 'Delete', name: 'delete' },
    ];


    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (!row) {
            return;
        }
    
        switch (actionName) {
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: this.objectName,
                        actionName: 'edit'
                    }
                });
            break;
    
            case 'view':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: this.objectName,
                        actionName: 'view'
                    }
                });
            break;

            case 'delete':
                const recordId = row.Id;
                deleteRecord(recordId)
                .then(() => {
                    const index = this.allRecordsOfSelectedObject.findIndex(record => record.Id === recordId);
                    this.allRecordsOfSelectedObject.splice(index, 1);

                    const toastEvent = new ShowToastEvent({
                        title: 'Success!',
                        message: 'Record has been deleted.',
                        variant: 'success'
                    });
                    this.dispatchEvent(toastEvent);
                })
                .catch(error => {
                    console.log(error);
                });
            break;

            default:
            break;
        }
    }


    @wire(fetchAllRecordsOfSelectedObject, { strObjectName: "$objectName" })
    wiredObjectRecords({ data, error }) {
        if (data) {
            let tempRecs = [];
            data.forEach((record) => {
            let tempRec = Object.assign({}, record);
            tempRec.tempName = "/" + tempRec.Id;
            tempRecs.push(tempRec);
            console.log(tempRec);
        });
            this.allRecordsOfSelectedObject = tempRecs;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.allRecordsOfSelectedObject = undefined;
        }
    }

    @api
    createCols(){
        const selectedFields=this.arrayToSend;
        this.columnsMap = [
            ...selectedFields.map(fieldName => ({
              label: fieldName,
              fieldName: fieldName==='Name'?'tempName':fieldName,
              type: fieldName === 'Name'?'url':'text',
              typeAttributes: {
                label: {
                    fieldName: 'Name',
                    target: '_blank'
                },
                target: fieldName === "Name" ? "_blank" : null,
            },
            })),
            {
            type: 'action',
            typeAttributes: {
                target: '_blank',
                rowActions: this.actions }
            }];
    }
}