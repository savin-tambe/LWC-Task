import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import fetchAllObjectList from '@salesforce/apex/sObjectController.fetchAllObjectList';


export default class ObjectFetchParent extends NavigationMixin(LightningElement) {

    @api objectList = [];
    @api objectName = ''; 
    @track showButton=false;   

    onObjectChange(event) { 
        this.showButton=true;
        this.objectName = event.detail.value;
    }

    connectedCallback() { 
        fetchAllObjectList()
        .then((result) => {
            if (result) {
                this.objectList = [];
                for (let key in result ) {
                    this.objectList.push({ label: key, value: key });
                }
            } else {
                console.log('Objects are not found')
            }
        }).catch((error) => {
            console.log('Objects are not found')
        });
    }

    handleCreateRecord() {
        //console.log('create record clicked');
        this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
        objectApiName: this.objectName,
        actionName: 'new'
        }     
    });
    }
}