import { Col, Divider, Layout, Row } from 'antd';
import {
  Analytics,
  Discord,
  Docs,
  Email,
  Forum,
  Github,
  Medium,
  Security,
  Twitter,
} from 'src/assets/icons';
import './styles.scss';

const socialItems = [
  {
    href: '/#',
    icon: Twitter,
    title: 'Twitter',
  },
  {
    href: '/#',
    icon: Discord,
    title: 'Discord',
  },
  {
    href: '/#',
    icon: Email,
    title: 'Email us',
  },
  {
    href: '/#',
    icon: Security,
    title: 'Security',
  },
  {
    href: '/#',
    icon: Docs,
    title: 'Docs',
  },
  {
    href: '/#',
    icon: Github,
    title: 'Github',
  },
  {
    href: '/#',
    icon: Analytics,
    title: 'Dune Analytics',
  },
  {
    href: '/#',
    icon: Medium,
    title: 'Medium',
  },
  {
    href: '/#',
    icon: Forum,
    title: 'Forum',
  },
];

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer className="footer">
      <div className="footer__container">
        <Row gutter={16}>
          <Col xs={24} sm={24} md={0} lg={0} className="footer__left">
            <div className="footer__left__logo">
              <span>VOTEE</span>
            </div>
          </Col>
          <Col xs={0} sm={0} md={11} lg={11} className="footer__left">
            <div className="footer__left__logo">
              <span>VOTEE</span>
            </div>
            <div className="footer__left__content">
              <p className="footer__left__highlight">
                Web3 gives back the data ownership to users.
                <br />
                BendDAO empowers Web3 data to be liquidity.
              </p>
              <p className="footer__left__text">
                BendDAO is the first NFT liquidity protocol supporting instant NFT-backed loans,
                Collateral Listing, and NFT Down Payment. The seamless experience of down payment,
                borrowing, and listing creates a perfect closed loop for users, a one-stop NFT
                liquidity solution.
              </p>
            </div>
          </Col>
          <Col xs={24} sm={24} md={13} lg={13} className="footer__right">
            <p className="footer__right__highlight">JOIN THE COMMUNITY</p>
            <h1>Follow our channels</h1>
            <Row gutter={32}>
              {socialItems.map((item, index) => (
                <Col xs={12} sm={12} md={8} lg={8} key={index}>
                  <a href={item.href} className="footer__right__item">
                    <img src={item.icon} alt={item.title} />
                    <p>{item.title}</p>
                  </a>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
        <Row className="footer__bottom">
          <Divider className="footer__bottom__divider" />
          <p className="footer__bottom__info">© Votee Lending Protocol</p>
          <div className="footer__bottom__term">
            <a href="/#" className="footer__bottom__item">
              Privacy Policy
            </a>
            <a href="/#" className="footer__bottom__item">
              Terms of Service
            </a>
          </div>
        </Row>
      </div>
    </Footer>
  );
};

export default AppFooter;
