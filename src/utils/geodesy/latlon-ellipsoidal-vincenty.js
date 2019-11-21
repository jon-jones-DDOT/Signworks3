/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Vincenty Direct and Inverse Solution of Geodesics on the Ellipsoid (c) Chris Veness 2002-2019  */
/*                                                                                   MIT Licence  */
/* www.movable-type.co.uk/scripts/latlong-ellipsoidal-vincenty.html                               */
/* www.movable-type.co.uk/scripts/geodesy-library.html#latlon-ellipsoidal-vincenty                */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

import LatLonEllipsoidal, { Dms } from './latlon-ellipsoidal.js';

const π = Math.PI;


/**
 * Distances & bearings between points, and destination points given start points & initial bearings,
 * calculated on an ellipsoidal earth model using ‘direct and inverse solutions of geodesics on the
 * ellipsoid’ devised by Thaddeus Vincenty.
 *
 * From: T Vincenty, "Direct and Inverse Solutions of Geodesics on the Ellipsoid with application of
 * nested equations", Survey Review, vol XXIII no 176, 1975. www.ngs.noaa.gov/PUBS_LIB/inverse.pdf.
 *
 * @module latlon-ellipsoidal-vincenty
 */

/* LatLonEllipsoidal_Vincenty - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/**
 * Extends LatLonEllipsoidal with methods for calculating distances and bearings between points, and
 * destination points given distances and initial bearings, accurate to within 0.5mm distance,
 * 0.000015″ bearing.
 *
 * By default, these calculations are made on a WGS-84 ellipsoid. For geodesic calculations on other
 * ellipsoids, monkey-patch the LatLon point by setting the datum of ‘this’ point to make it appear
 * as a LatLonEllipsoidal_Datum or LatLonEllipsoidal_ReferenceFrame point: e.g.
 *
 *     import LatLon, { Dms } from '../latlon-ellipsoidal-vincenty.js';
 *     import { datums }      from '../latlon-ellipsoidal-datum.js';
 *     const le = new LatLon(50.065716, -5.713824);  // in OSGB-36
 *     const jog = new LatLon(58.644399, -3.068521); // in OSGB-36
 *     le.datum = datums.OSGB36;     // source point determines ellipsoid to use
 *     const d = le.distanceTo(jog); // = 969982.014; 27.848m more than on WGS-84 ellipsoid
 *
 * @extends LatLonEllipsoidal
 */
class LatLonEllipsoidal_Vincenty extends LatLonEllipsoidal {

    /**
     * Returns the distance between ‘this’ point and destination point along a geodesic on the
     * surface of the ellipsoid, using Vincenty inverse solution.
     *
     * @param   {LatLon} point - Latitude/longitude of destination point.
     * @returns {number} Distance in metres between points or NaN if failed to converge.
     *
     * @example
     *   const p1 = new LatLon(50.06632, -5.71475);
     *   const p2 = new LatLon(58.64402, -3.07009);
     *   const d = p1.distanceTo(p2); // 969,954.166 m
     */
    distanceTo(point) {
        try {
            const dist = this.inverse(point).distance;
            return Number(dist.toFixed(3)); // round to 1mm precision
        } catch (e) {
            if (e instanceof EvalError) return NaN; // λ > π or failed to converge
            throw e;
        }
    }


    /**
     * Returns the initial bearing (forward azimuth) to travel along a geodesic from ‘this’ point to
     * the given point, using Vincenty inverse solution.
     *
     * @param   {LatLon} point - Latitude/longitude of destination point.
     * @returns {number} Initial bearing in degrees from north (0°..360°) or NaN if failed to converge.
     *
     * @example
     *   const p1 = new LatLon(50.06632, -5.71475);
     *   const p2 = new LatLon(58.64402, -3.07009);
     *   const b1 = p1.initialBearingTo(p2); // 9.1419°
     */
    initialBearingTo(point) {
        try {
            const brng = this.inverse(point).initialBearing;
            return Number(brng.toFixed(7)); // round to 0.001″ precision
        } catch (e) {
            if (e instanceof EvalError) return NaN; // λ > π or failed to converge
            throw e;
        }
    }


    /**
     * Returns the final bearing (reverse azimuth) having travelled along a geodesic from ‘this’
     * point to the given point, using Vincenty inverse solution.
     *
     * @param   {LatLon} point - Latitude/longitude of destination point.
     * @returns {number} Final bearing in degrees from north (0°..360°) or NaN if failed to converge.
     *
     * @example
     *   const p1 = new LatLon(50.06632, -5.71475);
     *   const p2 = new LatLon(58.64402, -3.07009);
     *   const b2 = p1.finalBearingTo(p2); // 11.2972°
     */
    finalBearingTo(point) {
        try {
            const brng = this.inverse(point).finalBearing;
            return Number(brng.toFixed(7)); // round to 0.001″ precision
        } catch (e) {
            if (e instanceof EvalError) return NaN; // λ > π or failed to converge
            throw e;
        }
    }


    /**
     * Returns the destination point having travelled the given distance along a geodesic given by
     * initial bearing from ‘this’ point, using Vincenty direct solution.
     *
     * @param   {number} distance - Distance travelled along the geodesic in metres.
     * @param   {number} initialBearing - Initial bearing in degrees from north.
     * @returns {LatLon} Destination point.
     *
     * @example
     *   const p1 = new LatLon(-37.95103, 144.42487);
     *   const p2 = p1.destinationPoint(54972.271, 306.86816); // 37.6528°S, 143.9265°E
     */
    destinationPoint(distance, initialBearing) {
        return this.direct(Number(distance), Number(initialBearing)).point;
    }


    /**
     * Returns the final bearing (reverse azimuth) having travelled along a geodesic given by initial
     * bearing for a given distance from ‘this’ point, using Vincenty direct solution.
     * TODO: arg order? (this is consistent with destinationPoint, but perhaps less intuitive)
     *
     * @param   {number} distance - Distance travelled along the geodesic in metres.
     * @param   {LatLon} initialBearing - Initial bearing in degrees from north.
     * @returns {number} Final bearing in degrees from north (0°..360°).
     *
     * @example
     *   const p1 = new LatLon(-37.95103, 144.42487);
     *   const b2 = p1.finalBearingOn(306.86816, 54972.271); // 307.1736°
     */
    finalBearingOn(distance, initialBearing) {
        const brng = this.direct(Number(distance), Number(initialBearing)).finalBearing;
        return Number(brng.toFixed(7)); // round to 0.001″ precision
    }


    /**
     * Vincenty direct calculation.
     *
     * Ellipsoid parameters are taken from datum of 'this' point. Height is ignored.
     *
     * @private
     * @param   {number} distance - Distance along bearing in metres.
     * @param   {number} initialBearing - Initial bearing in degrees from north.
     * @returns (Object} Object including point (destination point), finalBearing.
     * @throws  {RangeError} Point must be on surface of ellipsoid.
     * @throws  {EvalError}  Formula failed to converge.
     */
    direct(distance, initialBearing) {
        if (this.height != 0) throw new RangeError('point must be on the surface of the ellipsoid');

        const φ1 = this.lat.toRadians(), λ1 = this.lon.toRadians();
        const α1 = initialBearing.toRadians();
        const s = distance;

        // allow alternative ellipsoid to be specified
        const ellipsoid = this.datum ? this.datum.ellipsoid : LatLonEllipsoidal.ellipsoids.WGS84;
        const { a, b, f } = ellipsoid;

        const sinα1 = Math.sin(α1);
        const cosα1 = Math.cos(α1);

        const tanU1 = (1-f) * Math.tan(φ1), cosU1 = 1 / Math.sqrt((1 + tanU1*tanU1)), sinU1 = tanU1 * cosU1;
        const σ1 = Math.atan2(tanU1, cosα1);
        const sinα = cosU1 * sinα1;
        const cosSqα = 1 - sinα*sinα;
        const uSq = cosSqα * (a*a - b*b) / (b*b);
        const A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
        const B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));

        let cos2σM = null, sinσ = null, cosσ = null, Δσ = null;

        let σ = s / (b*A), σʹ, iterations = 0;
        do {
            cos2σM = Math.cos(2*σ1 + σ);
            sinσ = Math.sin(σ);
            cosσ = Math.cos(σ);
            Δσ = B*sinσ*(cos2σM+B/4*(cosσ*(-1+2*cos2σM*cos2σM)-
                B/6*cos2σM*(-3+4*sinσ*sinσ)*(-3+4*cos2σM*cos2σM)));
            σʹ = σ;
            σ = s / (b*A) + Δσ;
        } while (Math.abs(σ-σʹ) > 1e-12 && ++iterations<100);
        if (iterations >= 100) throw new EvalError('Vincenty formula failed to converge'); // not possible?

        const x = sinU1*sinσ - cosU1*cosσ*cosα1;
        const φ2 = Math.atan2(sinU1*cosσ + cosU1*sinσ*cosα1, (1-f)*Math.sqrt(sinα*sinα + x*x));
        const λ = Math.atan2(sinσ*sinα1, cosU1*cosσ - sinU1*sinσ*cosα1);
        const C = f/16*cosSqα*(4+f*(4-3*cosSqα));
        const L = λ - (1-C) * f * sinα * (σ + C*sinσ*(cos2σM+C*cosσ*(-1+2*cos2σM*cos2σM)));
        const λ2 = λ1 + L;

        const α2 = Math.atan2(sinα, -x);

        const destinationPoint = new LatLonEllipsoidal_Vincenty(φ2.toDegrees(), λ2.toDegrees(), 0, this.datum);

        return {
            point:        destinationPoint,
            finalBearing: Dms.wrap360(α2.toDegrees()),
            iterations:   iterations,
        };
    }


    /**
     * Vincenty inverse calculation.
     *
     * Ellipsoid parameters are taken from datum of 'this' point. Height is ignored.
     *
     * @private
     * @param   {LatLon} point - Latitude/longitude of destination point.
     * @returns {Object} Object including distance, initialBearing, finalBearing.
     * @throws  {TypeError}  Invalid point.
     * @throws  {RangeError} Points must be on surface of ellipsoid.
     * @throws  {EvalError}  Formula failed to converge.
     */
    inverse(point) {
        if (!(point instanceof LatLonEllipsoidal)) throw new TypeError(`invalid point ‘${point}’`);
        if (this.height!=0 || point.height!=0) throw new RangeError('point must be on the surface of the ellipsoid');

        const p1 = this, p2 = point;
        const φ1 = p1.lat.toRadians(), λ1 = p1.lon.toRadians();
        const φ2 = p2.lat.toRadians(), λ2 = p2.lon.toRadians();

        // allow alternative ellipsoid to be specified
        const ellipsoid = this.datum ? this.datum.ellipsoid : LatLonEllipsoidal.ellipsoids.WGS84;
        const { a, b, f } = ellipsoid;

        const L = λ2 - λ1;
        const tanU1 = (1-f) * Math.tan(φ1), cosU1 = 1 / Math.sqrt((1 + tanU1*tanU1)), sinU1 = tanU1 * cosU1;
        const tanU2 = (1-f) * Math.tan(φ2), cosU2 = 1 / Math.sqrt((1 + tanU2*tanU2)), sinU2 = tanU2 * cosU2;

        let sinλ = null, cosλ = null, sinσ = 0, cosσ = 0, sinα = null;
        let sinSqσ = null, cosSqα = 0, cos2σM = 0, σ = null, C = null;

        let λ = L, λʹ, iterations = 0;
        const antimeridian = Math.abs(L) > π;
        do {
            sinλ = Math.sin(λ);
            cosλ = Math.cos(λ);
            sinSqσ = (cosU2*sinλ) * (cosU2*sinλ) + (cosU1*sinU2-sinU1*cosU2*cosλ) * (cosU1*sinU2-sinU1*cosU2*cosλ);
            if (Math.abs(sinSqσ) < Number.EPSILON) break;  // co-incident points
            sinσ = Math.sqrt(sinSqσ);
            cosσ = sinU1*sinU2 + cosU1*cosU2*cosλ;
            σ = Math.atan2(sinσ, cosσ);
            sinα = cosU1 * cosU2 * sinλ / sinσ;
            cosSqα = 1 - sinα*sinα;
            cos2σM = (cosSqα != 0) ? (cosσ - 2*sinU1*sinU2/cosSqα) : 0; // on equatorial line cos²α = 0 (§6)
            C = f/16*cosSqα*(4+f*(4-3*cosSqα));
            λʹ = λ;
            λ = L + (1-C) * f * sinα * (σ + C*sinσ*(cos2σM+C*cosσ*(-1+2*cos2σM*cos2σM)));
            const iterationCheck = antimeridian ? Math.abs(λ)-π : Math.abs(λ);
            if (iterationCheck > π) throw new EvalError('λ > π');
        } while (Math.abs(λ-λʹ) > 1e-12 && ++iterations<1000);
        if (iterations >= 1000) throw new EvalError('Vincenty formula failed to converge');

        const uSq = cosSqα * (a*a - b*b) / (b*b);
        const A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
        const B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));
        const Δσ = B*sinσ*(cos2σM+B/4*(cosσ*(-1+2*cos2σM*cos2σM)-
            B/6*cos2σM*(-3+4*sinσ*sinσ)*(-3+4*cos2σM*cos2σM)));

        const s = b*A*(σ-Δσ);

        const α1 = Math.atan2(cosU2*sinλ,  cosU1*sinU2-sinU1*cosU2*cosλ);
        const α2 = Math.atan2(cosU1*sinλ, -sinU1*cosU2+cosU1*sinU2*cosλ);

        return {
            distance:       s,
            initialBearing: Math.abs(s) < Number.EPSILON ? NaN : Dms.wrap360(α1.toDegrees()),
            finalBearing:   Math.abs(s) < Number.EPSILON ? NaN : Dms.wrap360(α2.toDegrees()),
            iterations:     iterations,
        };
    }

}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

export { LatLonEllipsoidal_Vincenty as default, Dms };
