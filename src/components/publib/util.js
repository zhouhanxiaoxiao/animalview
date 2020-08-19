var util = {}

util.isNull = function (obj){
    if (obj == null){
        return true;
    }
    if (obj == undefined){
        return true;
    }
    if(obj == ""){
        return true
    }
    if (obj.length == 0){
        return true;
    }
    return false;
}

export default util;