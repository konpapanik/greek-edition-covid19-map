import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import axios from 'axios';
import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';

const LOCATION = {
  lat: 56.171061,
  lng: 13.757027
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 3.75;

const ThirdPage = () => {

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement: map } = {}) {
    let response;

    try {
      response = await axios.get('https://covid-19-greece.herokuapp.com/refugee-camps');
    } catch(e) {
      console.log(`Failed to fetch countries: ${e.message}`, e);
      return;
    }

    const { data = [] } = response;
    const hasData = Array.isArray(data) && data.length >= 0;

    if ( !hasData ) return;

    const geoJson = {
      type: 'FeatureCollection',
      features: data.map((country = {}) => {
        const { region_gr = {} } = country;
        const { latitude: lat, longtitude: lng } = region_gr;
        return {
          type: 'Feature',
          properties: {
            ...country,
          },
          geometry: {
            type: 'Point',
            coordinates: [ lng, lat ]
          }
        }
      })
    }

    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;

        const {
          region_gr,
          case_detection_week,
          name_gr,
          country,
          todayCases,
          total_confirmed_cases,
          active,
          critical,
          recovered
        } = properties

        casesString = `${total_confirmed_cases}`;

        if ( total_confirmed_cases > 50 ) {
          casesString = `${casesString.slice(0, -3)}k+`
        }

        if ( case_detection_week ) {
          updatedFormatted = new Date(case_detection_week).toLocaleString();
        }

        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${country}</h2>
              <ul>
                <li><strong>Κρούσματα:</strong> ${total_confirmed_cases}</li>
                <li><strong>Κρούσματα σήμερα:</strong> ${todayCases}</li>
                <li><strong>Θάνατοι:</strong> ${name_gr}</li>
                <li><strong>Θάνατοι σήμερα:</strong> ${region_gr}</li>
                <li><strong>COVID19 Αctive:</strong> ${active}</li>
                <li><strong>Διασωληνωμένοι:</strong> ${critical}</li>
                <li><strong>Ανάρωσαν:</strong> ${recovered}</li>
                <li><strong>Τελευταία ανανέωση:</strong> ${updatedFormatted}</li>
              </ul>
            </span>
            ${ casesString }
          </span>
        `;

        return L.marker( latlng, {
          icon: L.divIcon({
            className: 'icon',
            html
          }),
          riseOnHover: true
        });
      }
    });

    geoJsonLayers.addTo(map)
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect,
    zoomSnap:0.25,
    zoomDelta: 0.50,
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>EUROPE COVID-19 Interactive Map live Update - Virus near by</title>
      </Helmet>

      <Map {...mapSettings} />

      <Container type="content" className="text-center home-start">
        <h2>Το Virus near by στις ευρωπαϊκές χώρες | Συνεχιζόμενες ενημερώσεις για περιπτώσεις COVID-19 και δοκιμές για τον ιό SARS-CoV-2 σε κάθε χώρα</h2>
        <p>Το Virus near by βρίσκει τα περιστατικά ιών στην Ευρώπη με βάση τις επίσημες πηγές που συνδέονται με τα δεδομένα υγείας</p>
        <pre>
          
        </pre>
        <p className="note">Coronavirus confirmed, active, recovered, today cases,today's deaths, how many are critical. How many SARS-CoV-2 tested per EU countries.</p>
      </Container>
    </Layout>
  );
};

export default ThirdPage;