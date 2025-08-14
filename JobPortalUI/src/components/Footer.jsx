import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="container mx-auto px-6 2xl:px-20 flex items-center justify-between gap-4 py-3 mt-20">
      <img src={assets.logo} alt="logo_img" width={160} />
      <p className="flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden">
        Copyright @InsiderJobs 2030 | All Rights Reserved.
      </p>
      <div className="flex gap-2.5">
        <img src={assets.facebook_icon} alt="facebook_icon" width={38} />
        <img src={assets.twitter_icon} alt="twitter_icon" width={38} />
        <img src={assets.instagram_icon} alt="instagram_icon" width={38} />
      </div>
    </div>
  );
};

export default Footer;
