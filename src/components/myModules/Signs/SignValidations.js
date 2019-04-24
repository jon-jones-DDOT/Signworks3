



//newCode is the mutcd.code that is being checked
// signs -  an array of signs on the signpost each sign should have a
// property called MUTCD that has the info from the sign catalog
export function MutcdDuplicate(newCode, signs) {

   
    let isDupe = false;
    for (let i = 0; i < signs.length; i++) {
        if (signs[i].MUTCD.code === newCode) {
            isDupe = true;
        }
    }
 console.log('isDupe :', isDupe);
 return isDupe
}