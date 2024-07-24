import { Carousel, Button, CarouselProps } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './styles.scss';

const CustomCarousel = ({ children, handleBeforeChange }: any) => {
  const CustomPrevArrow = (props: any) => {
    const { style, onClick, className } = props;
    return (
      <Button
        className={`prev-arrow ${className}`}
        {...style}
        onClick={onClick}
        icon={<LeftOutlined className="" />}
      />
    );
  };

  const CustomNextArrow = (props: any) => {
    const { style, onClick, className } = props;
    return (
      <Button
        className={`next-arrow ${className}`}
        {...style}
        onClick={onClick}
        icon={<RightOutlined className="" />}
      />
    );
  };

  const settings: CarouselProps = {
    initialSlide: 0,
    speed: 500,
    dots: false,
    waitForAnimate: true,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  return (
    <Carousel {...settings} arrows dotPosition="top" dots beforeChange={handleBeforeChange}>
      {children}
    </Carousel>
  );
};

export default CustomCarousel;
