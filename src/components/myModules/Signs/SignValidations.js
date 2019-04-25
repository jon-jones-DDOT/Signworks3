import {parkingtypesigns, mphSigns} from "../../../SignworksJSON";

// newCode is the mutcd.code that is being checked signs -  an array of signs on
// the signpost each sign should have a property called MUTCD that has the info
// from the sign catalog
export function MutcdDuplicate(newCode, signs) {

    let isDupe = "";
    for (let i = 0; i < signs.length; i++) {
        if (signs[i].MUTCD.code === newCode) {
            isDupe =true;
        }
    }
   
    return isDupe
}

export function isSpeedLimit(mutt) {
    mutt = mutt.toUpperCase();
    const speedy = mphSigns.find((code) => {
       
        if (code === mutt) {
            return mutt;
        }
    })
   
if (speedy){
    return ""
}
else
    return "disabled";

}

export function zoneVerify (edState) {

//regex 
const anc = /[A-G]/
const ward = /[1-8]/
const amp = /[&]/

const ward1 = edState.ward1?edState.ward1:"";
const ward2 = edState.ward2?edState.ward2:"";
const anc1 = edState.anc1?edState.anc1:"";
const anc2 = edState.anc2?edState.anc2:"";


        //assemble zone
      let  zoneValue = ward1 + anc1;
     
        if (ward2) {
            zoneValue += "&" + ward2 + anc2;
        }
        else if (anc2) {
            // you've got a anc with no ward
            return false;

        }
     



    // alert(zoneValue);
    // verify zone with same script as python server side
    // this algorithm is overly rigorous since unlike the server side, the zone value is constrained by input controls.  But it should work and might be needed later
   
    if (zoneValue == "" || !zoneValue) {
        // this was an error before , but having an empty value is ok
        // above is an old comment, might not be "true" in 3.0
        return true;
    }
    if (zoneValue.length < 1) {
        return true;
    }
    
    if (ward.test(zoneValue[0])) {
        // we have a ward in first position
        if (zoneValue.length < 2) {
            // it was just a single ward
            return true;
        }
        if (amp.test(zoneValue[1])) {
            //single digit ward and ...
            if (ward.test(zoneValue[2])) {
                //single digit ward and ward and ...
                if (zoneValue.length < 4) {
                    //single digit ward and single digit ward and done
                    return true;
                }
                if (anc.test(zoneValue[3])) {
                    // single digit ward and ward+anc and done
                    return true;
                }
                else {
                    //single digit ward and some garbage
                    return false;
                }
            }
        }
        else if (anc.test(zoneValue[1])) {
            // ward + anc
            if (zoneValue.length < 3) {
                // ward + anc and done
                return true;
            }
            else if (amp.test(zoneValue[2])) {
                // ward + anc and ...
                if (zoneValue.length < 4) {
                    // oops, nothing after the ampersand
                    // we could just fix it here clip the ampersand
                    return false;
                }
                else if (ward.test(zoneValue[3])) {
                    // ward + anc and ward and ...
                    if (zoneValue.length < 5) {
                        // ward + anc and single digit ward and done
                        return true;
                    }
                    else if (zoneValue.length > 5) {
                        // too many characters  - - shouldn't happen here but check anyway
                        return false;
                    }
                    else if (anc.test(zoneValue[4])) {
                        // ward + anc and ward = anc and done
                        return true;
                    }
                    else {
                        // ward + anc + ward + garbage
                        return false;
                    }
                }
                else {
                    // ward + anc + ampersand + garbage
                    return false;
                }
            }
            else {
                // ward + anc + garbage
                return false;
            }
        }
        else {
            //ward + garbage
            return false;
        }



    }
    else {
        //garbage from the get go
        return false;
    }
    //should never get here
    return false;
};


/*
function zoneCheck (evt) {


    if (props.ward1 != "") {
        $anc1.attr('disabled', "");
    }
    else {
        $anc1.attr('disabled', "");
        $anc1.val("");
    }
    if (props.ward2 != "") {
        $anc2.attr('disabled', "");
    }
    else {
        $anc2.attr('disabled', "");
        $anc2.val("");
    }
    var err = zoneVerify("");
    if (err) {
        $zoneDiv.removeClass("edit_div");
        $zoneDiv.addClass("edit_div_err");
        verify(flagOR, "");
    }
    else {
        $zoneDiv.removeClass("edit_div_err");
        $zoneDiv.addClass("edit_div");
        verify(flagORX, "");
        feature.attributes.ZONE_ID = zoneValue;
    }
}
*/