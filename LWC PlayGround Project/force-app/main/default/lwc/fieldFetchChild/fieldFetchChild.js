import { LightningElement, api, track, wire } from 'lwc';
import fetchAllFieldsForSelectedObject from '@salesforce/apex/sObjectController.fetchAllFieldsForSelectedObject';

export default class FieldFetchChild extends LightningElement {

    @api objectChildName= '';  
    @track lstFields = []; 
    @track arrayToSend=[];
    @api showButton=false;

    @wire (fetchAllFieldsForSelectedObject,{strObjectName:'$objectChildName'})
    wiredFields({data,error}){
		if(data){
            this.lstFields=[];
            for(let key in data){
                this.lstFields.push({label:key,value:key,type:'action'});
                }
            }else if(error){
                console.log('Fields are not fetched');
        }
	}

    handleCheckBoxClick(event) {
        this.arrayToSend=[];
        for(let index in event.detail.value) {
            this.arrayToSend.push(event.detail.value[index])
        }
    }

    handleShowData(event) {
        this.template.querySelector("c-record-fetch-grandchild").createCols();
    }
    }
