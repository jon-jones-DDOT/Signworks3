export class SupportType {
    name = (index, domain) => {
        let codedValue = "but";
        switch (domain) {
            case 'SUPPORTTYPE':
             codedValue = this._codedValuesSupportType;
             break;
            default:
              codedValue = null;


        }
        try {
            console.log('index', codedValue)
            for (var i = 0; i < codedValue.length; i++) {

                if (codedValue[i].code == index) {
                    return codedValue[i].name;
                }
            }

            return "coded domain is broken";
        } catch (err) {
            alert(err.message);
        }
    }

    _codedValuesSupportType = [
        {
            "name": "U-Post",
            "code": 8
        }, {
            "name": "Square Steel Post",
            "code": 9
        }, {
            "name": "Utility Post",
            "code": 10
        }, {
            "name": "Wall/Fence",
            "code": 11
        }, {
            "name": "Bridge",
            "code": 12
        }, {
            "name": "Overhead Structure",
            "code": 13
        }, {
            "name": "Other Support",
            "code": 14
        }, {
            "name": "Meter Post (Single)",
            "code": 15
        }, {
            "name": "Meter Post (Double)",
            "code": 16
        }, {
            "name": "Meter Kiosk (Multi)",
            "code": 17
        }, {
            "name": "Combo (Signal and Streetlight)",
            "code": 1
        }, {
            "name": "Signal",
            "code": 2
        }, {
            "name": "Wood Post 4x4",
            "code": 4
        }, {
            "name": "Streetlight",
            "code": 6
        }
    ]

}