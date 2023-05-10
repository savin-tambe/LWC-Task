public with sharing class sObjectController {
    
    @AuraEnabled(cacheable = true)
    public static Map<String,String> fetchAllObjectList(){   
        Map<String,String> mapOfAllObject = new  Map<String,String>();
        for(Schema.SObjectType objTyp : Schema.getGlobalDescribe().Values())
        {
            String name = objTyp.getDescribe().getName();
            String label = objTyp.getDescribe().getLabel();
            mapOfAllObject.put(name,label);
        }
        return mapOfAllObject;
    }
    @AuraEnabled(cacheable = true)
    public static Map<String,String> fetchAllFieldsForSelectedObject(String strObjectName){   
        Map<String, Schema.SObjectType> detail = Schema.getGlobalDescribe();
        Map<String,String> mapOfFields = new  Map<String,String>();
        for(Schema.SObjectField fields :detail.get(strObjectName).getDescribe().fields.getMap().Values()) {
                mapOfFields.put(fields.getDescribe().getName() , fields.getDescribe().getName());
        }
        return mapOfFields;
    }
    @AuraEnabled(cacheable=true)  
    public static List<sObject> fetchAllRecordsOfSelectedObject(String strObjectName) { 
        Map<String, Schema.SObjectType> detail = Schema.getGlobalDescribe();
        List<String> allFieldsOfSelectedObject = new  List<String>();
        for(Schema.SObjectField fields :detail.get(strObjectName).getDescribe().fields.getMap().Values()) {
            allFieldsOfSelectedObject.add(fields.getDescribe().getName());
        }
        string allFields = string.join(allFieldsOfSelectedObject,','); 
        String query = 'select ' + allFields +' from '  + strObjectName;     
        return Database.query(query);  

    }

    @AuraEnabled(cacheable=true)
    public static void recordsListCol(Id recordId){
    }
}