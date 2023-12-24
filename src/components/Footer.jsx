import _ from "lodash";

import { useLocation, useNavigate } from "react-router-dom";
import { Menus } from "../helper/datas/menu";

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const social = [
    {
      id: 1,
      link: "https://instagram.com/bromagindia?utm_source=qr&igshid=MThlNWY1MzQwNA==",
      name: "igram",
    },
    {
      id: 2,
      link: "https://www.facebook.com/bromagindia?mibextid=ZbWKwL",
      name: "fbook",
    },
    {
      id: 3,
      link: "https://whatsapp.com/channel/0029VaBEhJ40gcfSjIZsQV04",
      name: "wup",
    },
    {
      id: 4,
      link: "https://www.youtube.com/@BROMAGINDIA",
      name: "ytube",
    },
    {
      id: 5,
      link: "https://www.linkedin.com/company/bromagindia/",
      name: "linkedin",
    },
  ];

  const footerLinks = [
    { id: 1, name: "Who we are", link: "/whoweare" },
    { id: 2, name: "Privacy Policy", link: "/privacy" },
    { id: 3, name: "Refund and Cancellation", link: "/cancellation" },
    { id: 4, name: " Terms and Condition", link: "/termsandcondition" },
  ];

  return (
    <div
      className={`bg-black !py-4 lg:!min-h-[53vh]  !text-white !z-50 !pb-10 ${["/booking-details", "/play-my-contest", "/my-profile"].includes(
        _.get(location, "pathname", "")
      )
          ? "!rounded-none"
          : "lg:!rounded-t-[50px] rounded-t-[25px]"
        }`}
    >
      <div className="!flex !flex-col ">
        <div className="lg:px-2">
          <img
            src={"/assets/logo/logo.png"}
            className="lg:!w-[150px] lg:!h-[150px]"
          />
        </div>
        <div className="flex lg:px-32 px-4 justify-between lg:flex-row flex-col-reverse gap-y-10">
          {/* contact us */}
          <div className="flex flex-col gap-y-10">
            <div className="flex flex-col lg:gap-y-10 gap-y-8">
              <h1 className="lg:text-2xl text-sm font-bold   text-[#EFEFEF] ">
                CONTACT US
                <img
                  src="/assets/icons/footerborder.png"
                  alt=""
                  className="lg:pt-1 pt-2"
                />
              </h1>
              <div className="flex flex-col lg:gap-y-2 gap-y-6 lg:text-2xl text-sm">
                <a
                  href="tel:+9191502 89762"
                  className="lg:pt-3 pt-1 cursor-pointer center_div justify-start gap-x-2"
                >
                  <img src="/assets/icons/call.png" className="w-[15px]" />
                  <h1 href="tel:+9191502 89762" className="pl-1 ">
                    +91 91502 89762
                  </h1>
                </a>
                <a
                  href="mailto:mag@bromagindia.com"
                  className="lg:pt-3 pt-1 cursor-pointer center_div justify-start gap-x-2"
                >
                  <img src="/assets/icons/email.png" className="w-[15px]" />
                  <h1 href="mailto:mag@bromagindia.com" className="pl-1 ">
                    mag@bromagindia.com
                  </h1>
                </a>
                <p className="lg:pt-3 pt-1 cursor-pointer center_div justify-start gap-x-2">
                  <img src="/assets/icons/location.png" className="w-[15px]" />
                  <span className="pl-1 ">Velachery, Chennai</span>
                </p>
              </div>
            </div>
            <div className="flex gap-x-5">
              {social.map((res, index) => {
                return (
                  <a key={index} href={res.link} target="_blank" rel="noreferrer">
                    <img
                      src={`/assets/icons/${res.name}.png`}
                      className="w-[25px] h-[25px]"
                    />
                  </a>
                );
              })}
            </div>
          </div>
          {/* about */}
          <div className="flex flex-col gap-y-10">
            <div className="flex flex-col lg:gap-y-10 gap-y-8 ">
              <h1 className="lg:text-2xl text-sm font-bold   text-[#EFEFEF] ">
                ABOUT US
                <img
                  src="/assets/icons/footerborder.png"
                  alt=""
                  className="pt-1"
                />
              </h1>
              <div className="flex flex-col gap-y-6  lg:text-2xl text-sm">
                {footerLinks.map((res, index) => {
                  return (
                    <p
                      key={index}
                      className="text-[#E5E5E5] cursor-pointer"
                      onClick={() => {
                        navigate(`${res.link}`);
                      }}
                    >
                      {res.name}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
          {/* website  */}
          <div className="flex flex-col gap-y-10">
            <div className="flex flex-col lg:gap-y-10 gap-y-8">
              <h1 className="lg:text-2xl text-sm font-bold   text-[#EFEFEF] ">
                QUICK ACCESS
                <img
                  src="/assets/icons/footerborder.png"
                  alt=""
                  className="pt-1"
                />
              </h1>
              <div className="flex flex-col gap-y-4 lg:text-xl text-sm">
                {Menus.map((res, index) => {
                  return (
                    <p
                      key={index}
                      className={`  ${res.navigations.includes(
                        _.get(location, "pathname", false)
                      )
                          ? "text-primary_color"
                          : "text-white"
                        } cursor-pointer`}
                      onClick={() => {
                        navigate(`${res.link}`);
                      }}
                    >
                      {res.name}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
