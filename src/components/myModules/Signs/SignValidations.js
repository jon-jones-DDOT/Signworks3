import {parkingtypesigns, mphSigns} from "../../../SignworksJSON";

// newCode is the mutcd.code that is being checked signs -  an array of signs on
// the signpost each sign should have a property called MUTCD that has the info
// from the sign catalog
export function MutcdDuplicate(newCode, signs) {

    let isDupe = false;
    for (let i = 0; i < signs.length; i++) {
        if (signs[i].MUTCD.code === newCode) {
            isDupe = true;
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
/*
function zoneVerify (fromSource) {


    if (!fromSource) {
        //assemble zone
        zoneValue = $ward1.val() + $anc1.val();
        if ($ward2.val()) {
            zoneValue += "&" + $ward2.val() + $anc2.val();
        }
        else if ($anc2.val()) {
            // you've got a anc with no ward
            return flagZone;

        }
    }




    // alert(zoneValue);
    // verify zone with same script as python server side
    // this algorithm is overly rigorous since unlike the server side, the zone value is constrained by input controls.  But it should work and might be needed later
    var verifiedZ = false;
    if (zoneValue == "" || !zoneValue) {
        // this was an error before , but having an empty value is ok
        return 0;
    }
    if (zoneValue.length < 1) {
        return flagZone;
    }
    var look = zoneValue[0];
    if (ward.test(zoneValue[0])) {
        // we have a ward in first position
        if (zoneValue.length < 2) {
            // it was just a single ward
            return 0;
        }
        if (amp.test(zoneValue[1])) {
            //single digit ward and ...
            if (ward.test(zoneValue[2])) {
                //single digit ward and ward and ...
                if (zoneValue.length < 4) {
                    //single digit ward and single digit ward and done
                    return 0;
                }
                if (anc.test(zoneValue[3])) {
                    // single digit ward and ward+anc and done
                    return 0;
                }
                else {
                    //single digit ward and some garbage
                    return flagZone;
                }
            }
        }
        else if (anc.test(zoneValue[1])) {
            // ward + anc
            if (zoneValue.length < 3) {
                // ward + anc and done
                return 0;
            }
            else if (amp.test(zoneValue[2])) {
                // ward + anc and ...
                if (zoneValue.length < 4) {
                    // oops, nothing after the ampersand
                    // we could just fix it here clip the ampersand
                    return flagZone;
                }
                else if (ward.test(zoneValue[3])) {
                    // ward + anc and ward and ...
                    if (zoneValue.length < 5) {
                        // ward + anc and single digit ward and done
                        return 0;
                    }
                    else if (zoneValue.length > 5) {
                        // too many characters  - - shouldn't happen here but check anyway
                        return flagZone;
                    }
                    else if (anc.test(zoneValue[4])) {
                        // ward + anc and ward = anc and done
                        return 0;
                    }
                    else {
                        // ward + anc + ward + garbage
                        return flagZone;
                    }
                }
                else {
                    // ward + anc + ampersand + garbage
                    return flagZone;
                }
            }
            else {
                // ward + anc + garbage
                return flagZone;
            }
        }
        else {
            //ward + garbage
            return flagZone;
        }



    }
    else {
        //garbage from the get go
        return flagZone;
    }
    //should never get here
    return -1;
};

function zoneCheck (evt) {


    if ($ward1.val() != "") {
        $anc1.attr('disabled', false);
    }
    else {
        $anc1.attr('disabled', true);
        $anc1.val("");
    }
    if ($ward2.val() != "") {
        $anc2.attr('disabled', false);
    }
    else {
        $anc2.attr('disabled', true);
        $anc2.val("");
    }
    var err = zoneVerify(false);
    if (err) {
        $zoneDiv.removeClass("edit_div");
        $zoneDiv.addClass("edit_div_err");
        verify(flagOR, flagZone);
    }
    else {
        $zoneDiv.removeClass("edit_div_err");
        $zoneDiv.addClass("edit_div");
        verify(flagORX, flagZone);
        feature.attributes.ZONE_ID = zoneValue;
    }
}
*/