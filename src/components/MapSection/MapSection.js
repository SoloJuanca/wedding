import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { useIntl } from 'react-intl';
import styles from './MapSection.module.css';

const locations = [
  {
    id: 1,
    type: 'venue',
    position: { lat: 25.4242, lng: -100.1525 }
  },
  {
    id: 2,
    type: 'hotel',
    position: { lat: 25.4250, lng: -100.1510 }
  },
  {
    id: 3,
    type: 'attraction',
    position: { lat: 25.4300, lng: -100.1500 }
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
                    <div className={styles.locationName}>
                      {intl.formatMessage({ id: `map.${location.type}.name` })}
                    </div>
                    <div className={styles.locationAddress}>
                      {intl.formatMessage({ id: `map.${location.type}.address` })}
                    </div>
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
                      <h3>{intl.formatMessage({ id: `map.${selectedLocation.type}.name` })}</h3>
                      <p>{intl.formatMessage({ id: `map.${selectedLocation.type}.address` })}</p>
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