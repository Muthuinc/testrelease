import _ from "lodash";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useHref } from "react-router-dom";
import { tokenVerification } from "../helper/api/apiHelper";
import { Avatar, Drawer, notification } from "antd";
import axios from "axios";
import { MdOutlineMenu } from "react-icons/md";
import { MdOutlineMenuOpen } from "react-icons/md";
import { useSelector } from "react-redux";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = useHref();
    const data = useSelector((data) => {
        return data;
    });

    const [menu, setMenu] = useState(false);

    const [currentUser, setCurrentUser] = useState([]);

    const fetchData = async () => {
        try {
            axios.defaults.headers.common[
                "aizasycoxsewxv2t64dxca-wl8n8qfq0gzux1as"
            ] = localStorage.getItem(
                "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
            );
            const result = await tokenVerification();
            setCurrentUser(_.get(result, "data.data", []));
        } catch (err) {
            if (_.get(err, "response.data.message", "") === "Invalid token") {
                notification.warning({
                    message: "Please Login",
                });
                localStorage.removeItem(
                    "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
                );
            } else {
                notification.error({
                    message: "Something went wrong",
                });
            }
        }
    };

    useEffect(() => {
        if (
            localStorage.getItem(
                "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
            )
        ) {
            fetchData();
        }
    }, [_.get(data, "auth.value", "")]);

    let Menus = [
        {
            id: 1,
            name: "Home",
            link: "/",
            navigations: [
                "/",
                "/play-my-contest",
                "/booking-details",
                "/food-deatils",
            ],
        },
        {
            id: 2,
            name: "Online Order",
            link: "/online-order",
            navigations: [
                "/cusines",
                "/online-order",
                "/online-order-cart",
                "/delivery-address",
            ],
        },
        {
            id: 3,
            name: "Dining",
            link: "/dining",
            navigations: [
                "/dining",
                "/dining-cusines",
                "/dining-cart",
                "/book-my-tables",
                "/dining-payment",
            ],
        },
        {
            id: 4,
            name: "Call for order",
            link: "/call-for-order",
            navigations: ["/call-for-order"],
        },
        {
            id: 5,
            name: "Take Away",
            link: "/take-away",
            navigations: [
                "/take-away",
                "/take-away-cusiness",
                "/take-away-cart",
            ],
        },
        // {
        //   id: 5,
        //   name: "Cart",
        //   link: "/my-cart",
        //   navigations: ["/my-cart", "/delivery-address"],
        // },
    ];

    const handleTrackLogin = () => {
        navigate("/login", { state: { backLocation: pathname } });
    };

    return (
        <div className="bg-black  w-screen lg:px-10 px-2 text-white flex items-center justify-between">
            <Link to={"/"}>
                <figure className="lg:w-[80px] lg:h-[80px] w-[50px]">
                    <img
                        src={"/assets/logo/logo.png"}
                        className="object-cover"
                    />
                </figure>
            </Link>
            <div className=" gap-x-20 lg:block hidden">
                <div className="center_div gap-x-20">
                    {/* menus */}
                    <div className="center_div gap-x-10 ">
                        {Menus.map((res, index) => {
                            return (
                                <Link
                                    to={res.link}
                                    className="flex flex-col items-center group cursor-pointer  "
                                    key={index}
                                >
                                    <div
                                        className={`center_div  group-hover:visible  ${
                                            res.navigations.includes(
                                                _.get(
                                                    location,
                                                    "pathname",
                                                    false
                                                )
                                            )
                                                ? "visible"
                                                : "invisible"
                                        }`}
                                    >
                                        <img
                                            src="/assets/icons/lines.png"
                                            alt=""
                                            className="w-[5px] h-[10px]"
                                        />
                                        <img
                                            src="/assets/icons/lines.png"
                                            alt=""
                                            className="w-[5px] h-[10px]"
                                        />
                                        <img
                                            src="/assets/icons/lines.png"
                                            alt=""
                                            className="w-[5px] h-[10px]"
                                        />
                                    </div>
                                    <h1
                                        className={`group-hover:text-primary_color ${
                                            res.navigations.includes(
                                                _.get(
                                                    location,
                                                    "pathname",
                                                    false
                                                )
                                            )
                                                ? "text-primary_color"
                                                : ""
                                        }`}
                                    >
                                        {res.name}
                                    </h1>
                                    <img
                                        src="/assets/icons/nav_bottom.png"
                                        alt=""
                                        className={`w-[20px] h-[10px]  group-hover:visible  ${
                                            res.navigations.includes(
                                                _.get(
                                                    location,
                                                    "pathname",
                                                    false
                                                )
                                            )
                                                ? "visible"
                                                : "invisible"
                                        }`}
                                    />
                                </Link>
                            );
                        })}
                    </div>
                    {/* login */}
                    {localStorage.getItem(
                        "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
                    ) ? (
                        <div className="flex items-center gap-x-5">
                            {/* <Tooltip title="logout">
                <LogoutOutlined
                  onClick={handleLogout}
                  className="-rotate-90 cursor-pointer hover:text-red-500 transition-all duration-500 ease-in-out"
                />
              </Tooltip> */}
                            <Link to="/my-account">
                                {!_.get(currentUser, "[0].user_image", "") ? (
                                    <Avatar className="!bg-primary_color cursor-pointer">
                                        <div className="!uppercase">
                                            {
                                                _.get(
                                                    currentUser,
                                                    "[0].user",
                                                    ""
                                                ).split("")[0]
                                            }
                                        </div>
                                    </Avatar>
                                ) : (
                                    <Avatar
                                        src={_.get(
                                            currentUser,
                                            "[0].user_image",
                                            ""
                                        )}
                                        className="!object-cover"
                                    />
                                )}
                            </Link>
                        </div>
                    ) : (
                        <div
                            onClick={handleTrackLogin}
                            className="px-2 min-w-[100px] cursor-pointer rounded-full py-1 bg-[#F2F2F2] text-black center_div text-sm gap-x-2 justify-start"
                        >
                            <div className="bg-[#D9D9D9] w-[20px] h-[20px] center_div rounded-full">
                                <img
                                    src="/assets/icons/user.png"
                                    alt=""
                                    className="w-[10px] h-auto "
                                />
                            </div>
                            Login
                        </div>
                    )}
                </div>
            </div>
            <div className="lg:hidden block">
                {!menu ? (
                    <MdOutlineMenu
                        onClick={() => {
                            setMenu(!menu);
                        }}
                    />
                ) : (
                    <MdOutlineMenuOpen
                        onClick={() => {
                            setMenu(!menu);
                        }}
                    />
                )}
            </div>
            <Drawer
                open={menu}
                onClose={() => {
                    setMenu(false);
                }}
                className="!w-[50%] !bg-black"
                placement="left"
                closable={false}
            >
                <div className=" flex flex-col justify-between gap-y-10 pl-4 py-4">
                    <div className="flex flex-col gap-y-10 lg:text-xl text-sm">
                        {Menus.map((res, index) => {
                            return (
                                <p
                                    key={index}
                                    className={`  ${
                                        res.navigations.includes(
                                            _.get(location, "pathname", false)
                                        )
                                            ? "text-primary_color"
                                            : "text-white"
                                    } cursor-pointer`}
                                    onClick={() => {
                                        setMenu(false);
                                        navigate(`${res.link}`);
                                    }}
                                >
                                    {res.name}
                                </p>
                            );
                        })}
                    </div>

                    {localStorage.getItem(
                        "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
                    ) ? (
                        <div
                            className="flex text-white"
                            onClick={() => {
                                setMenu(false);
                                navigate("/profile");
                            }}
                        >
                            {/* <Avatar className="!bg-primary_color cursor-pointer " >
                  <div className="!uppercase">
                    {_.get(currentUser, "username", "").split("")[0]}
                  </div>
                </Avatar> */}
                            <div
                                className={`${
                                    [
                                        "/profile-online-order",
                                        "/profile-take-away-order",
                                        "/profile-call-for-order",
                                        "/profile-table-booking",
                                        "/profile-delivery-address",
                                        "/profile-my-reviews",
                                        "/profile-my-contest",
                                        "/my-account",
                                        "/profile",
                                    ].includes(
                                        _.get(location, "pathname", false)
                                    )
                                        ? "text-primary_color"
                                        : "text-white"
                                }`}
                            >
                                My Profile
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="!text-white">
                            Login
                        </Link>
                    )}
                </div>
            </Drawer>
        </div>
    );
}

export default Navbar;
