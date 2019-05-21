# Changelog

## [2.0.1] - 2019-04-10

### Fixed

- Add missing n-vector spherical alongTrackDistanceTo() method
- Add missing .toUtm() method to LatLon object returned by Utm.toLatLon()
- Fix n-vector spherical isWithinExtent() for point in different hemisphere
- Fix vector3d angleTo() for case where plane normal n is in the plane
- Rationalise/harmonise exception messages

### Added

- README ‘docs’ badge with link to documentation

## [2.0.0] - 2019-02-14

### Changed

- Restructured to use ES modules, ES2015 syntax
- Separated n-vector functions into spherical / ellipsoidal
- General rationalisation of API

### Added

- Modern terrestrial reference frames (TRFs) to complement historical datums
- LatLon.parse() methods
- latlon.toString() numeric format ‘n’

### Breaking

- LatLon is now a class, so the new operator is no longer optional on the constructor
- latlon.bearingTo() is now latlon.initialBearingTo()
- latlon.toString() defaults to ‘d’ in place of ‘dms’
- LatLon.ellipse, LatLon.datum are now LatLon.ellipses, LatLon.datums
- Dms.parseDMS() is now simply Dms.parse()
- Dms.toDMS() is now Dms.toDms()
- Dms.defaultSeparator (between degree, minute, second values) defaults to ‘narrow no-break space’ in place of no space
