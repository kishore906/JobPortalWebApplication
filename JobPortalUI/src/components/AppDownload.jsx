import { assets } from "../assets/assets";

const AppDownload = () => {
  return (
    <div className="container mx-auto px-6 2xl:px-20 my-20">
      <div className="relative bg-gradient-to-r from-violet-50 to-purple-50 p-12 sm:p-24 lg:p-32 rounded-lg">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-8 max-w-md">
            Download Mobile App For Better Experience
          </h1>

          <div className="flex gap-4">
            <a href="#" className="inline-block">
              <img
                src={assets.play_store}
                alt="play_store_img"
                className="h-12"
              />
            </a>
            <a href="#" className="inline-block">
              <img
                src={assets.app_store}
                alt="app_store_img"
                className="h-12"
              />
            </a>
          </div>
        </div>
        <img
          src={assets.app_main_img}
          alt="app_main_img"
          className="absolute w-80 right-0 bottom-0 mr-32 max-lg:hidden"
        />
      </div>
    </div>
  );
};

export default AppDownload;
