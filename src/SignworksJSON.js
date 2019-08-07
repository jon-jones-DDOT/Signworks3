import React from "react"

export class SupportType {
    name = (index, domain) => {
        if (index === null) {
            return null;
        }
        let codedValue = "but";
        switch (domain) {
            case 'SUPPORTTYPE':
                codedValue = this._codedValuesSupportType;
                break;
            case 'SUPPORTSTATUS':
                codedValue = this._codedValuesSupportStatus;
                break;
            default:
                codedValue = null;

        }
        try {

            for (var i = 0; i < codedValue.length; i++) {

                if (codedValue[i].code === index) {
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

    _codedValuesSupportStatus = [
        {
            "name": "Active",
            "code": 1
        },/*
         {
            "name": "Prospective",
            "code": 2
        }, {
            "name": "Temporarily Out of Service",
            "code": 3
        }, {
            "name": "Temporary",
            "code": 4
        },*/
        {
            "name": "Retired",
            "code": 5
        },/*
         {
            "name": "Requested (New)",
            "code": 6
        }, {
            "name": "Requested (Change)",
            "code": 7
        }, {
            "name": "Requested (Remove)",
            "code": 8
        } */
    ]
}

export class SignType {
    name = (index, domain) => {

        if (index === null) {
            return null;
        }
        let codedValue = "but";
        switch (domain) {
            case 'TIMEBAND_DAYS':
                codedValue = this._codedValuesTimebandDays;
                break;
            case 'TIMEBAND_HOURS':
                codedValue = this._codedValuesTimebandHours;
                break;
            case "TIMEBAND_HOUR_LIMITS":
                codedValue = this._codedValuesHourLimits;
                break;
            default:
                codedValue = null;

        }
        try {

            for (var i = 0; i < codedValue.length; i++) {

                if (codedValue[i].code === index) {
                    return codedValue[i].name;
                }
            }

            return "coded domain is broken " + domain + " " + index;
        } catch (err) {
            alert(err.message);
        }
    }

    _codedValuesTimebandDays = [
        {
            code: 0,
            name: ""
        }, {
            "name": "Monday",
            "code": 1
        }, {
            "name": "Tuesday",
            "code": 2
        }, {
            "name": "Wednesday",
            "code": 3
        }, {
            "name": "Thursday",
            "code": 4
        }, {
            "name": "Friday",
            "code": 5
        }, {
            "name": "Saturday",
            "code": 6
        }, {
            "name": "Sunday",
            "code": 7
        }, {
            "name": "ANYTIME",
            "code": 8
        }, {
            "name": "Schooldays",
            "code": 9
        }
    ]

    _codedValuesTimebandHours = [
        {
            code: "",
            name: ""
        }, {
            "name": "0400A",
            "code": 1
        }, {
            "name": "0415A",
            "code": 2
        }, {
            "name": "0430A",
            "code": 3
        }, {
            "name": "0445A",
            "code": 4
        }, {
            "name": "0500A",
            "code": 5
        }, {
            "name": "0515A",
            "code": 6
        }, {
            "name": "0530A",
            "code": 7
        }, {
            "name": "0545A",
            "code": 8
        }, {
            "name": "0600A",
            "code": 9
        }, {
            "name": "0615A",
            "code": 10
        }, {
            "name": "0630A",
            "code": 11
        }, {
            "name": "0645A",
            "code": 12
        }, {
            "name": "0700A",
            "code": 13
        }, {
            "name": "0715A",
            "code": 14
        }, {
            "name": "0730A",
            "code": 15
        }, {
            "name": "0745A",
            "code": 16
        }, {
            "name": "0800A",
            "code": 17
        }, {
            "name": "0815A",
            "code": 18
        }, {
            "name": "0830A",
            "code": 19
        }, {
            "name": "0845A",
            "code": 20
        }, {
            "name": "0900A",
            "code": 21
        }, {
            "name": "0915A",
            "code": 22
        }, {
            "name": "0930A",
            "code": 23
        }, {
            "name": "0945A",
            "code": 24
        }, {
            "name": "1000A",
            "code": 25
        }, {
            "name": "1015A",
            "code": 26
        }, {
            "name": "1030A",
            "code": 27
        }, {
            "name": "1045A",
            "code": 28
        }, {
            "name": "1100A",
            "code": 29
        }, {
            "name": "1115A",
            "code": 30
        }, {
            "name": "1130A",
            "code": 31
        }, {
            "name": "1145A",
            "code": 32
        }, {
            "name": "1200P",
            "code": 33
        }, {
            "name": "1215P",
            "code": 34
        }, {
            "name": "1230P",
            "code": 35
        }, {
            "name": "1245P",
            "code": 36
        }, {
            "name": "0100P",
            "code": 37
        }, {
            "name": "0115P",
            "code": 38
        }, {
            "name": "0130P",
            "code": 39
        }, {
            "name": "0145P",
            "code": 40
        }, {
            "name": "0200P",
            "code": 41
        }, {
            "name": "0215P",
            "code": 42
        }, {
            "name": "0230P",
            "code": 43
        }, {
            "name": "0245P",
            "code": 44
        }, {
            "name": "0300P",
            "code": 45
        }, {
            "name": "0315P",
            "code": 46
        }, {
            "name": "0330P",
            "code": 47
        }, {
            "name": "0345P",
            "code": 48
        }, {
            "name": "0400P",
            "code": 49
        }, {
            "name": "0415P",
            "code": 50
        }, {
            "name": "0430P",
            "code": 51
        }, {
            "name": "0445P",
            "code": 52
        }, {
            "name": "0500P",
            "code": 53
        }, {
            "name": "0515P",
            "code": 54
        }, {
            "name": "0530P",
            "code": 55
        }, {
            "name": "0545P",
            "code": 56
        }, {
            "name": "0600P",
            "code": 57
        }, {
            "name": "0615P",
            "code": 58
        }, {
            "name": "0630P",
            "code": 59
        }, {
            "name": "0645P",
            "code": 60
        }, {
            "name": "0700P",
            "code": 61
        }, {
            "name": "0715P",
            "code": 62
        }, {
            "name": "0730P",
            "code": 63
        }, {
            "name": "0745P",
            "code": 64
        }, {
            "name": "0800P",
            "code": 65
        }, {
            "name": "0815P",
            "code": 66
        }, {
            "name": "0830P",
            "code": 67
        }, {
            "name": "0845P",
            "code": 68
        }, {
            "name": "0900P",
            "code": 69
        }, {
            "name": "0915P",
            "code": 70
        }, {
            "name": "0930P",
            "code": 71
        }, {
            "name": "0945P",
            "code": 72
        }, {
            "name": "1000P",
            "code": 73
        }, {
            "name": "1015P",
            "code": 74
        }, {
            "name": "1030P",
            "code": 75
        }, {
            "name": "1045P",
            "code": 76
        }, {
            "name": "1100P",
            "code": 77
        }, {
            "name": "1115P",
            "code": 78
        }, {
            "name": "1130P",
            "code": 79
        }, {
            "name": "1145P",
            "code": 80
        }, {
            "name": "1200A",
            "code": 81
        }, {
            "name": "1215A",
            "code": 82
        }, {
            "name": "1230A",
            "code": 83
        }, {
            "name": "1245A",
            "code": 84
        }, {
            "name": "0100A",
            "code": 85
        }, {
            "name": "0115A",
            "code": 86
        }, {
            "name": "0130A",
            "code": 87
        }, {
            "name": "0145A",
            "code": 88
        }, {
            "name": "0200A",
            "code": 89
        }, {
            "name": "0215A",
            "code": 90
        }, {
            "name": "0230A",
            "code": 91
        }, {
            "name": "0245A",
            "code": 92
        }, {
            "name": "0300A",
            "code": 93
        }, {
            "name": "0315A",
            "code": 94
        }, {
            "name": "0330A",
            "code": 95
        }, {
            "name": "0345A",
            "code": 96
        }, {
            "name": "BLANK",
            "code": 97
        }, {
            "name": "BLANK",
            "code": 98
        }, {
            "name": "BLANK",
            "code": 99
        }, {
            "name": "ANYTIME",
            "code": 100
        }, {
            "name": " ",
            "code": 0
        }
    ]

    _codedValuesHourLimits = [
        {
            code: 0,
            name: "    "
        }, {
            code: .25,
            name: "15 min"
        }, {
            code: .5,
            name: "30 min"
        }, {
            code: 1,
            name: "1 hour"
        }, {
            code: 1.5,
            name: "1.5 hour"
        }, {
            code: 2,
            name: "2 hour"
        }, {
            code: 2.5,
            name: "2.5 hour"
        }, {
            code: 3,
            name: "3 hour"
        }, {
            code: 3.5,
            name: "3.5 hour"
        }, {
            code: 4,
            name: "4 hour"
        }, {
            code: 4.5,
            name: "4.5 hour"
        }, {
            code: 5,
            name: "5 hour"
        }
    ]

    _codedValuesSpeedLimit = [
        {
            code: 0,
            name: " "
        }, {
            code: 5,
            name: "5"
        }, {
            code: 10,
            name: "10"
        }, {
            code: 15,
            name: "15"
        }, {
            code: 20,
            name: "20"
        }, {
            code: 25,
            name: "25"
        }, {
            code: 30,
            name: "30"
        }, {
            code: 35,
            name: "35"
        }, {
            code: 40,
            name: "40"
        }, {
            code: 45,
            name: "45"
        }, {
            code: 50,
            name: "50"
        }, {
            code: 55,
            name: "55"
        }, {
            code: 60,
            name: "60"
        }, {
            code: 65,
            name: "65"
        }, {
            code: 70,
            name: "70"
        }
    ]

    _codedValuesSignStatus = [
        {
            "name": "Active",
            "code": 1
        },
        /* {
            "name": "Prospective",
            "code": 2
        }, {
            "name": "Temporarily Out of Service",
            "code": 3
        }, {
            "name": "Temporary",
            "code": 4
        },*/
        {
            "name": "Retired",
            "code": 5
        },
        /* {
            "name": "Requested (New)",
            "code": 6
        }, {
            "name": "Requested (Change)",
            "code": 7
        }, {
            "name": "Requested (Remove)",
            "code": 8
        } */
    ]

    _codedValuesWards = [
        {
            code: "",
            name: ""
        }, {
            code: 1,
            name: "1"
        }, {
            code: 2,
            name: "2"
        }, {
            code: 3,
            name: "3"
        }, {
            code: 4,
            name: "4"
        }, {
            code: 5,
            name: "5"
        }, {
            code: 6,
            name: "6"
        }, {
            code: 7,
            name: "7"
        }, {
            code: 8,
            name: "8"
        }
    ]

    _codedValuesAnc = [
        {
            code: "",
            name: ""
        }, {
            code: "A",
            name: "A"
        }, {
            code: "B",
            name: "B"
        }, {
            code: "C",
            name: "C"
        }, {
            code: "D",
            name: "D"
        }, {
            code: "E",
            name: "E"
        }, {
            code: "F",
            name: "F"
        }, {
            code: "G",
            name: "G"
        }
    ]

}

export function addOptionsToSelect(options) {
    return options.map((value, index) => (
        <option key={`item-${index}`} value={value.code}>
            {value.name}</option>
    ))
}

export const mphSigns = [
    "R2-1",
    "R2-1(5)",
    "R2-1(10)",
    "R2-1(15)",
    "R2-1(20)",
    "R2-1(25)",
    "R2-1(30)",
    "R2-1(35)",
    "R2-1(40)",
    "R2-1(45)",
    "R2-1(50)",
    "R2-1(55)",
    "R2-1(60)",
    "R2-1(65)",
    "R2-1(70)",
    "R2-1(75)",
    "R2-2",
    "R2-2P",
    "R2-3",
    "R2-3P",
    "R2-4",
    "R2-4P",
    "R2-4a",
    "R2-5B",
    "S5-1",
    "W1-1a",
    "W1-2a",
    "W13-1",
    "W13-2",
    "W13-3"
];

export const parkingtypesigns = [
    'R-NS-006',
    'R-NS-011',
    'R-NS-012',
    'R-NS-013',
    'R-NS-015',
    'R-NS-017',
    'R-NS-019',
    'R-NS-022',
    'R-NS-026',
    'R-NS-038',
    'R-NS-052',
    'R-NS-053',
    'R-NS-059',
    'R-NS-064',
    'R-NS-075',
    'R-NS-080',
    'R-NS-121',
    'R-NS-122',
    'R-NS-131',
    'R-NS-133',
    'R-NS-141',
    'R-NS-148',
    'R-NS-172',
    'R-NS-174',
    'R-NS-180',
    'R-NS-185',
    'R-NS-210',
    'R-NS-215',
    'R-NS-213',
    'R-NS-214',
    'R-NS-056',
    'R-NS-LZSHARED',
    'R-NS-OLD',
    'R-NS_ROP',
    'R-NS-RPP',
    'R-DC-2HROLD',
    'R-DC-2HROLD',
    'R-DC-2HR',
    'R-DC-NSNP',
    'R-DC-NSNP_EXCEPTION',
    'R-DC-PTPCOIN',
    'R-DC-Taxi_2',
    'R-DC-NO_PARK_ENTRANCE_TIMES',
    'R-DC-Diplomat',
    'R-DC-No_Park_Russia_Embassy',
    'R-DC-No_Parking_Generic_w_Time',
    'R-DC-Diplomat_Kazakhstan',
    'R-DC-No_Stand_Bus',
    'R-DC-Diplomat_Eq_Guinea',
    'R-DC-Embassy _Angola',
    'R-DC-Embassy _Diplomat_Mexico',
    'R-DC-15_Min_Parking1',
    'R-DC-One_Hour_Parking_Eastern_Market',
    'R-DC-School_Parking_Zone_15_Min',
    'R-DC-School_Loading_Zones2',
    'R-DC-School_Loading_Zones3',
    'R-DC-15_Min_Parking2',
    'R-DC-Back_in_Parking',
    'R-NS-157',
    'R-NS-120',
    'R-DC-One_Way_Yellow',
    'R-DC-Reserved_DCGov',
    'D-NS-011',
    'D-NS-038',
    'D-NS-039',
    'D-NS-055',
    'R-NS-046',
    'R-NS-134',
    'R-DC-Hotel_Load',
    'R-NS-LZPTL',
    'R-NS-LZSPECIAL',
    'O-NS-024',
    'R8-3',
    'R8-3a'
];