import { GoogleMap, Marker } from '@react-google-maps/api';

import './styles.scss';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { C1045, MSG } from 'src/constants/errorCode';

interface SimpleMapProps {
  width?: string;
  height?: string;
  className?: string;
  latitude: any;
  longitude: any;
}
export default function SimpleMap(props: SimpleMapProps) {
  const { className, latitude, longitude } = props;
  const center = useMemo(() => ({ lat: +latitude, lng: +longitude }), [latitude, longitude]);
  const [, setMaps] = useState<any>();

  const { t } = useTranslation();

  if (!navigator.geolocation) {
    throw new Error(t(MSG[C1045]));
  }

  const handleClickMap = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      '_blank',
    );
  };

  return (
    <div
      className={`${className} bg-white flex items-center justify-center`}
      onClick={handleClickMap}
    >
      <GoogleMap
        mapContainerClassName={className}
        center={center}
        zoom={8}
        onLoad={(map: any) => {
          setMaps(map);
        }}
        options={{
          gestureHandling: 'greedy',
          zoomControl: false,
          fullscreenControl: false,
          scrollwheel: true,
          disableDoubleClickZoom: true,
        }}
      >
        <Marker position={{ lat: center?.lat, lng: center?.lng }} />
      </GoogleMap>
    </div>
  );
}
