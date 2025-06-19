import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { useIntl } from 'react-intl';
import styles from './MapSection.module.css';

const locations = [
  {
    id: 1,
    type: 'venue',
    name: 'Las Nubes - Evento Principal',
    position: { lat: 25.4242, lng: -100.1525 },
    link: 'https://maps.app.goo.gl/pdZzouwKoMPhKkTM6'
  },
  {
    id: 2,
    type: 'hotel',
    name: 'Holiday Inn Express Monterrey Tecnológico',
    position: { lat: 25.655, lng: -100.293 },
    link: 'https://www.google.com/maps/search/?api=1&query=Holiday+Inn+Express+Monterrey+Tecnologico'
  },
  {
    id: 3,
    type: 'hotel',
    name: 'Novotel Monterrey Valle',
    position: { lat: 25.647, lng: -100.324 },
    link: 'https://www.google.com/maps/search/?api=1&query=Novotel+Monterrey+Valle'
  },
  {
    id: 4,
    type: 'hotel',
    name: 'NH Collection Monterrey San Pedro',
    position: { lat: 25.650, lng: -100.315 },
    link: 'https://www.google.com/maps/search/?api=1&query=NH+Collection+Monterrey+San+Pedro'
  },
  {
    id: 5,
    type: 'hotel',
    name: 'Fiesta Inn Monterrey Valle',
    position: { lat: 25.646, lng: -100.323 },
    link: 'https://www.google.com/maps/search/?api=1&query=Fiesta+Inn+Monterrey+Valle'
  },
  {
    id: 6,
    type: 'attraction',
    name: 'Cerro de la Silla',
    position: { lat: 25.630499, lng: -100.237845 },
    link: 'https://www.google.com/maps/search/?api=1&query=Cerro+de+la+Silla+Monterrey'
  },
  {
    id: 7,
    type: 'attraction',
    name: 'Parque Fundidora',
    position: { lat: 25.678704, lng: -100.284301 },
    link: 'https://www.google.com/maps/search/?api=1&query=Parque+Fundidora+Monterrey'
  },
  {
    id: 8,
    type: 'attraction',
    name: 'Barbie Dream Lounge – Plaza Áuriga',
    position: { lat: 25.665000, lng: -100.310000 }, // estimado, no encontré coords públicas
    link: 'https://www.google.com/maps/search/?api=1&query=Barbie+Dream+Lounge+Plaza+Auriga+Monterrey'
  },
  {
    id: 9,
    type: 'attraction',
    name: 'Fashion Drive',
    position: { lat: 25.656500, lng: -100.382000 }, // zona San Pedro cerca Av Diego Rivera
    link: 'https://www.google.com/maps/search/?api=1&query=Fashion+Drive+Monterrey'
  },
  {
    id: 10,
    type: 'attraction',
    name: 'Sealand Acuarioventura – Galerías Valle Oriente',
    position: { lat: 25.6383251, lng: -100.3138271 },
    link: 'https://maps.app.goo.gl/yn8kHPa8PVTYA7DM6'
  },
  {
    id: 11,
    type: 'attraction',
    name: 'Cascada Cola de Caballo',
    position: { lat: 25.362317, lng: -100.163467 },
    link: 'https://www.google.com/maps/search/?api=1&query=Cola+de+Caballo+Santiago+Nuevo+Leon'
  },
  {
    id: 12,
    type: 'attraction',
    name: 'Presa La Boca (Rodrigo Gómez)',
    position: { lat: 25.4167, lng: -100.1170 },
    link: 'https://www.google.com/maps/search/?api=1&query=Presa+La+Boca+Santiago+Nuevo+Leon'
  }  
];

const MapSection = () => {
  const intl = useIntl();
  const [selectedLocation, setSelectedLocation] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('venue');
  const [map, setMap] = React.useState(null);
  const mapCenter = { lat: 25.4242, lng: -100.1525 };

  const mapStyles = {
    height: '100%',
    width: '100%'
  };

  const getMarkerIcon = (type) => {
    const icons = {
      venue: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      hotel: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      attraction: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
    };
    return icons[type] || 'https://maps.google.com/mapfiles/ms/icons/gray-dot.png';
  };

  const onLoad = React.useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    if (map) {
      map.panTo(location.position);
      map.setZoom(15);
    }
  };

  const handleDirectionsClick = (location) => {
    if (location.link) {
      window.open(location.link, '_blank');
    }
  };

  const groupedLocations = locations.reduce((acc, location) => {
    if (!acc[location.type]) {
      acc[location.type] = [];
    }
    acc[location.type].push(location);
    return acc;
  }, {});

  const locationTypes = {
    venue: intl.formatMessage({ id: 'map.tabs.venue' }),
    hotel: intl.formatMessage({ id: 'map.tabs.hotel' }),
    attraction: intl.formatMessage({ id: 'map.tabs.attraction' })
  };

  return (
    <section id="location" className={styles.section}>
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {intl.formatMessage({ id: 'map.title' })}
      </motion.h2>

      <motion.div
        className={styles.contentContainer}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className={styles.tabsContainer}>
          {Object.entries(locationTypes).map(([type, label]) => (
            <button
              key={type}
              className={`${styles.tabButton} ${activeTab === type ? styles.active : ''}`}
              onClick={() => setActiveTab(type)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.mapAndListContainer}>
          <div className={styles.locationsList}>
            {Object.entries(groupedLocations).map(([type, locations]) => (
              <div
                key={type}
                className={`${styles.locationGroup} ${activeTab === type ? styles.active : ''}`}
              >
                <h3 className={styles.locationGroupTitle}>
                  {locationTypes[type]}
                </h3>
                {locations.map(location => (
                  <div
                    key={location.id}
                    className={`${styles.locationItem} ${selectedLocation?.id === location.id ? styles.active : ''}`}
                    onClick={() => handleLocationClick(location)}
                  >
                    <div className={styles.locationInfo}>
                      <div className={styles.locationName}>
                        {location.name || intl.formatMessage({ id: `map.${location.type}.name` })}
                      </div>
                      {location.type === 'hotel' && (
                        <div className={styles.locationAddress}>
                          Hotel en Monterrey, Valle Oriente
                        </div>
                      )}
                      {location.type === 'venue' && (
                        <div className={styles.locationAddress}>
                          {intl.formatMessage({ id: `map.${location.type}.address` })}
                        </div>
                      )}
                      {location.type === 'attraction' && (
                        <div className={styles.locationAddress}>
                          Atracción turística en Monterrey
                        </div>
                      )}
                    </div>
                    {location.link && (location.type === 'hotel' || location.type === 'attraction') && (
                      <button
                        className={styles.directionsButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDirectionsClick(location);
                        }}
                        title="Ver en Google Maps"
                      >
                        📍
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.mapContainer}>
            <LoadScript 
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              onLoad={() => console.log('Google Maps API loaded')}
            >
              <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={14}
                center={mapCenter}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                {map && locations.map(location => (
                  <Marker
                    key={location.id}
                    position={location.position}
                    icon={{
                      url: getMarkerIcon(location.type),
                      scaledSize: new window.google.maps.Size(32, 32)
                    }}
                    onClick={() => handleLocationClick(location)}
                  />
                ))}

                {selectedLocation && (
                  <InfoWindow
                    position={selectedLocation.position}
                    onCloseClick={() => setSelectedLocation(null)}
                  >
                    <div className={styles.infoWindowContent}>
                      <h3>{selectedLocation.name || intl.formatMessage({ id: `map.${selectedLocation.type}.name` })}</h3>
                      {selectedLocation.type === 'hotel' && (
                        <p>Hotel en Monterrey, Valle Oriente</p>
                      )}
                      {selectedLocation.type === 'venue' && (
                        <p>{intl.formatMessage({ id: `map.${selectedLocation.type}.address` })}</p>
                      )}
                      {selectedLocation.type === 'attraction' && (
                        <p>Atracción turística en Monterrey</p>
                      )}
                      {selectedLocation.link && (selectedLocation.type === 'hotel' || selectedLocation.type === 'attraction') && (
                        <button
                          onClick={() => handleDirectionsClick(selectedLocation)}
                          className={styles.directionsLink}
                        >
                          Ver en Google Maps
                        </button>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default MapSection; 