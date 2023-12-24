/* eslint-disable no-empty */
/* eslint-disable react-hooks/exhaustive-deps */
import {
    Badge,
    Divider,
    Select,
    Skeleton,
    Tag,
    notification,
    message,
} from "antd";
import { useEffect, useState } from "react";
import { useHref, useLocation, useNavigate } from "react-router-dom";
import _ from "lodash";
import {
    addToCart,
    decrementCartQuantity,
    getAllCusinessFilter,
    getCurrentUserCarts,
    getFilteredProducts,
    incrementCartQuantity,
    removeSoloFromCart,
} from "../../helper/api/apiHelper";
import { CiDiscount1 } from "react-icons/ci";

const Cusinedetails = () => {
    const [subCategory, setSubCategory] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentSubCategory, setCurrentSubCategory] = useState("");

    const [selectFilter, setSelectFilter] = useState();
    const [loading, setLoading] = useState(false);
    const [allCusinesCategory, setAllCusinesData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [currentCartsData, setCurrentCartsData] = useState([]);
    const [allCartsData, setAllCartsData] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();
    const currentLocation = useHref();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await getAllCusinessFilter(
                selectFilter || _.get(location, "state.currentCatid", "")
            );
            setAllCusinesData(_.get(result, "data.data.categoryData", []));
            setSubCategory(_.get(result, "data.data.subCategoryData", []));
            let filterDatas;
            if (selectFilter || _.get(location, "state.currentCatid", "")) {
                filterDatas = _.get(
                    result,
                    "data.data.categoryData",
                    []
                ).filter((res) => {
                    return selectFilter
                        ? res._id === selectFilter
                        : res._id === _.get(location, "state.currentCatid", "");
                });
            } else {
                filterDatas = _.get(result, "data.data.categoryData", []);
                setSelectFilter(
                    _.get(result, "data.data.categoryData[0]._id", "")
                );
            }
            setFilteredData(filterDatas);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            notification.error({ message: "Something went wrong" });
        }
    };

    useEffect(() => {
        if (_.get(location, "pathname", "") === "/dining-cusines") {
            if (!_.get(location, "state.currentCatid", "")) {
                navigate("/dining");
            }
        }
        fetchData();
    }, [_.get(location, "state.currentCatid", ""), selectFilter]);

    const fetechProductData = async () => {
        try {
            setLoading(true);
            let searchItems = {
                cat: selectFilter || _.get(location, "state.currentCatid", ""),
                subCat: currentSubCategory || "",
            };
            const productDatas = await getFilteredProducts(
                JSON.stringify(searchItems)
            );
            setLoading(false);
            setProductData(_.get(productDatas, "data.data", []));
        } catch (err) {
            setLoading(false);
            notification.error({ message: "Something went wrong" });
        }
    };

    useEffect(() => {
        fetechProductData();
    }, [
        _.get(location, "state.currentCatid", ""),
        selectFilter,
        currentSubCategory,
    ]);

    const fetchCurrentUserCarts = async () => {
        try {
            setLoading(true);
            let orderStatus = getOrderReferance();
            let current_carts = await getCurrentUserCarts(orderStatus);
            let cardsref = "";
            if (_.get(location, "pathname", "") === "/dining-cusines") {
                cardsref = _.get(current_carts, "data.data", [])
                    .filter((res) => {
                        return (
                            res.bookingRef ===
                            _.get(location, "state.table_details._id", "")
                        );
                    })
                    .map((res) => {
                        return res.productRef;
                    });
            } else {
                cardsref = _.get(current_carts, "data.data", []).map((res) => {
                    return res.productRef;
                });
            }
            setAllCartsData(_.get(current_carts, "data.data", []));
            setCurrentCartsData(cardsref);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            return notification.error({ message: "Something went wrong" });
        }
    };

    useEffect(() => {
        if (
            localStorage.getItem(
                "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
            )
        ) {
            fetchCurrentUserCarts();
        }
    }, []);

    const getOrderReferance = () => {
        let orderRef = "";
        let path = _.get(location, "pathname", "");
        if (path === "/take-away-cusiness") {
            orderRef = "takeaway_order";
        } else if (path === "/cusines") {
            orderRef = "online_order";
        } else if (path === "/dining-cusines") {
            orderRef = "dining_order";
        }
        return orderRef;
    };

    const handleNotLoginUsers = () => {
        if (selectFilter || _.get(location, "state.currentCatid", "")) {
            navigate("/login", {
                state: {
                    currentCatid:
                        selectFilter ||
                        _.get(location, "state.currentCatid", ""),
                    backLocation: currentLocation,
                },
            });
        }
    };

    const handleCartClick = async (product) => {
        if (
            localStorage.getItem(
                "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
            )
        ) {
            try {
                setLoading(true);
                let orderStatus = getOrderReferance();
                let formData = {
                    productRef: _.get(product, "_id", ""),
                    orderRef: orderStatus,
                };
                if (orderStatus === "dining_order") {
                    formData.bookingRef = _.get(
                        location,
                        "state.table_details._id",
                        ""
                    );
                }
                const result = await addToCart(formData);
                message.success(_.get(result, "data.message", ""));
                fetchCurrentUserCarts();
                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
                notification.error({ message: "Something went wrong" });
            }
        } else {
            handleNotLoginUsers();
        }
    };

    const handlegotocart = () => {
        if (
            localStorage.getItem(
                "chgi5kjieaoyaiackaiw_bbcqgy4akacsaiq_bbcqgyyaq"
            )
        ) {
            let path = _.get(location, "pathname", "");
            if (path === "/take-away-cusiness") {
                navigate("/take-away-cart");
            } else if (path === "/cusines") {
                navigate("/online-order-cart");
            } else if (path === "/dining-cusines") {
                navigate("/dining-cart", {
                    state: _.get(location, "state", ""),
                });
            }
        } else {
            handleNotLoginUsers();
        }
    };

    const getCardId = (id) => {
        return allCartsData?.filter((res) => {
            return res.productRef === id;
        });
    };

    const getQuantity = (id) => {
        try {
            let qty = getCardId(id);
            return _.get(qty, "[0].quantity", 0);
        } catch (err) {}
    };

    const handleIncrement = async (id) => {
        try {
            let _id = getCardId(id);
            await incrementCartQuantity(_.get(_id, "[0]._id", ""));
            message.success("quantity updated");
            fetchData();
            fetchCurrentUserCarts();
        } catch (err) {
            console.log(err);
        }
    };

    const handleDecrement = async (id) => {
        try {
            let _id = getCardId(id);
            if (getQuantity(id) > 1) {
                await decrementCartQuantity(_.get(_id, "[0]._id", ""));
                message.success("quantity updated");
            } else {
                await removeSoloFromCart(_.get(_id, "[0]._id", ""));
                message.success("Food removed from cart");
            }
            fetchData();
            fetchCurrentUserCarts();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="w-screen lg:px-20 px-2  flex flex-col lg:gap-y-10 min-h-screen lg:pb-20 pb-5">
            <div className="flex flex-col lg:gap-y-14 gap-y-8">
                <div className="flex items-center justify-between pt-11">
                    <div>
                        <h1 className="text-dark_color font-medium lg:text-xl ">
                            Order food &nbsp;{" "}
                            {!_.isEmpty(
                                _.get(location, "state.table_details", [])
                            ) &&
                                `for Table ${_.get(
                                    location,
                                    "state.table_details.tableNo",
                                    ""
                                )}`}
                        </h1>
                        <img src="/assets/icons/orderborder.png" alt="" />
                    </div>
                    <div className="mr-4 lg:hidden block">
                        <Badge
                            size="small"
                            offset={[-14, 5]}
                            color="#DF9300"
                            count={`${currentCartsData?.length}`}
                            className=" lg:hidden block"
                        >
                            <Tag
                                onClick={handlegotocart}
                                className="!bg-black text-white lg:hidden lg:text-lg text-[10px] block cursor-pointer rounded-md lg:px-4 lg:py-2 font-bold"
                                color="yellow"
                            >
                                go to cart
                            </Tag>
                        </Badge>
                    </div>
                </div>
                <Skeleton
                    active
                    loading={loading}
                    className="lg:w-[500px] lg:h-[100px]"
                >
                    <div className="flex flex-col lg:gap-y-10 gap-y-8">
                        <div className="flex gap-x-10 items-center justify-between">
                            <div className="flex gap-x-10 lg:items-center lg:flex-row flex-col">
                                <div
                                    loading={loading}
                                    className="!text-[#3A3A3A] !font-semibold lg:!text-5xl flex gap-x-2 !capitalize"
                                >
                                    <span>
                                        {" "}
                                        {_.get(filteredData, "[0].name", "")}
                                    </span>{" "}
                                    Cusines
                                </div>
                                <div className="pt-2 lg:w-full">
                                    <Select
                                        showSearch
                                        placeholder="Other cusines"
                                        optionFilterProp="children"
                                        className="!cursor-pointer !w-full !border-[#494949] focus:!border-[#494949] hover:!border-[#494949]"
                                        onChange={(e) => {
                                            setCurrentSubCategory("");
                                            setSelectFilter(e);
                                        }}
                                    >
                                        {allCusinesCategory.map(
                                            (res, index) => {
                                                return (
                                                    <Select.Option
                                                        key={index}
                                                        value={res._id}
                                                    >
                                                        {res.name}
                                                    </Select.Option>
                                                );
                                            }
                                        )}
                                    </Select>
                                </div>
                            </div>
                            <div className="mr-4 lg:block hidden">
                                <Badge
                                    size="small"
                                    offset={[-14, 5]}
                                    color="#DF9300"
                                    count={`${currentCartsData?.length}`}
                                >
                                    <Tag
                                        onClick={handlegotocart}
                                        className="!bg-black text-white  cursor-pointer rounded-md px-4 py-2 font-bold"
                                        color="yellow"
                                    >
                                        go to cart
                                    </Tag>
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <div className="center_div justify-start lg:gap-x-6 gap-x-4 flex-nowrap overflow-scroll">
                                {subCategory.map((res, index) => {
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                setCurrentSubCategory(
                                                    currentSubCategory ===
                                                        res._id
                                                        ? ""
                                                        : res._id
                                                );
                                            }}
                                            className={`${
                                                res._id === currentSubCategory
                                                    ? "bg-[#000000] text-white"
                                                    : "bg-[#EFEFEF] text-[#4D4D4D]"
                                            } w-fit lg:px-3 lg:py-2 py-1 rounded-2xl center_div lg:min-w-[150px] min-w-[100px] text-sm lg:text-lg cursor-pointer`}
                                        >
                                            {res.name}
                                        </div>
                                    );
                                })}
                            </div>
                            <Divider className="!bg-[#B8B8B8]" />
                        </div>
                    </div>
                </Skeleton>
            </div>
            {/* foods */}
            <div className="flex flex-col lg:gap-y-24">
                {productData.map((res, index) => {
                    return (
                        <Skeleton
                            key={index}
                            loading={loading}
                            active
                            className="w-[500px] h-[200px] "
                        >
                            <div className="flex w-full lg:items-center justify-between gap-y-10 lg:flex-row   flex-col lg:shadow-none shadow-2xl  rounded-lg lg:px-0 py-10 lg:py-0 px-4">
                                <div className="center_div justify-start gap-x-4">
                                    {/* image */}
                                    <img
                                        src={res.image}
                                        alt=""
                                        className="lg:w-36 lg:h-36  w-full h-[30vh] md:h-[50vh] rounded-lg"
                                    />
                                    {/* price details */}
                                    <div className="flex flex-col gap-y-2 lg:pt-0 pt-8">
                                        <h1 className="text-[#3A3A3A] font-semibold lg:text-3xl">
                                            {res.name}
                                        </h1>
                                        <div className="flex gap-x-2 items-center">
                                            <div className="text-[#999999] font-medium lg:text-md">
                                                Price
                                            </div>
                                            <div className="text-[rgb(87,87,87)] relative">
                                                &#8377; {res.price}
                                                <img
                                                    src="/assets/icons/linecross.png"
                                                    alt=""
                                                    className="absolute top-1"
                                                />
                                            </div>
                                            <Tag
                                                color="green"
                                                className="flex items-center  gap-x-1"
                                            >
                                                {" "}
                                                <CiDiscount1 className="text-primary_color text-lg font-bold" />
                                                {res.offer}%
                                            </Tag>
                                        </div>
                                        <div className="text-[#FF2424]  lg:text-md flex items-center gap-x-2 ">
                                            Discount price{" "}
                                            <div className="text-[#292929] ">
                                                &#8377; {res.discountPrice}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* cart button */}
                                {currentCartsData.includes(res._id) ? (
                                    <div
                                        className={` 
                                                 text-white bg-black    font-medium center_div rounded-2xl   min-w-[200px] cursor-pointer flex justify-between items-center`}
                                    >
                                        <div
                                            onClick={() => {
                                                handleDecrement(res._id);
                                            }}
                                            className="w-[40%] hover:bg-primary_color py-2  rounded-l-2xl center_div"
                                        >
                                            -
                                        </div>
                                        <div className=" font-bold">
                                            {getQuantity(res._id)}
                                        </div>
                                        <div
                                            onClick={() => {
                                                handleIncrement(res._id);
                                            }}
                                            className="w-[40%] hover:bg-primary_color py-2 rounded-r-2xl center_div"
                                        >
                                            +
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => {
                                            handleCartClick(res);
                                        }}
                                        className={` bg-[#000000] text-white  hover:bg-primary_color  font-medium center_div rounded-2xl px-3 py-2 min-w-[200px] cursor-pointer`}
                                    >
                                        Add to cart
                                    </div>
                                )}
                            </div>
                        </Skeleton>
                    );
                })}
            </div>
        </div>
    );
};

export default Cusinedetails;
