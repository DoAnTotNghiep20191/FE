import './styles.scss';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': MyElementAttributes;
    }

    interface MyElementAttributes {
      src: string;
      alt?: string;
      ar?: any;
      poster?: string;
      load?: () => void;
    }
  }
}

interface Props {
  src: string;
  alt?: string;
  poster?: string;
  className?: string;
  onLoad?: () => void;
}

const Image3D = ({
  src,
  poster = '',
  className = '',
  alt = '3D Image',
  onLoad,
  ...restProps
}: Props) => {
  return (
    <div className={`default-3d-viewer ${className}`}>
      <model-viewer
        alt={alt}
        src={src}
        poster={poster}
        ar
        ar-modes="webxr scene-viewer quick-look"
        environment-image=""
        shadow-intensity="1"
        auto-ronate
        camera-controls
        touch-action="pan-y"
        load={onLoad}
        {...restProps}
      ></model-viewer>
    </div>
  );
};

export default Image3D;
