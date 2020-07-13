import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import axios from 'axios';
import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';

const LOCATION = {
  lat: 45.714732,
  lng: 125.110404
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 3;

const SixthPage = () => {

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement: map } = {}) {
    let response;

    try {
      response = await axios.get('https://corona.lmao.ninja/v2/countries');
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
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;
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
          country,
          todayCases,
          updated,
          cases,
          deaths,
          todayDeaths,
          active,
          critical,
          tests,
          recovered
        } = properties

        casesString = `${cases}`;

        if ( cases > 1000 ) {
          casesString = `${casesString.slice(0, -3)}k+`
        }

        if ( updated ) {
          updatedFormatted = new Date(updated).toLocaleString();
        }

        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${country}</h2>
              <ul>
                <li><strong>Κρούσματα:</strong> ${cases}</li>
                <li><strong>Κρούσματα σήμερα:</strong> ${todayCases}</li>
                <li><strong>Θάνατοι:</strong> ${deaths}</li>
                <li><strong>Θάνατοι σήμερα:</strong> ${todayDeaths}</li>
                <li><strong>COVID19 Αctive:</strong> ${active}</li>
                <li><strong>Διασωληνωμένοι:</strong> ${critical}</li>
                <li><strong>Tests που έγιναν:</strong> ${tests}</li>
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
        <title>Ασία COVID-19 Interactive Map live Update - Virus near by</title>
      </Helmet>

      <Map {...mapSettings} />

      <Container type="content" className="text-center home-start">
        <h2>Virus near by στις χώρες της Ασίας | Live update COVID-19 cases </h2>
        <p>Τα περιστατικά ιών στην Ασία βάσει των επίσημων πηγών που συνδέονται με δεδομένα. </p>
        <pre>
          
        </pre>
        <p className="note">Live Update of the Coronavirus confirmed, recovered and deaths</p>
      </Container>
    </Layout>
  );
};

export default SixthPage;