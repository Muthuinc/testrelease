/* eslint-disable no-empty */
import {
    Button,
    Divider,
    Drawer,
    Empty,
    Modal,
    Radio,
    message,
    notification,
} from "antd";
import { useEffect, useState } from "react";
import AddNewAddress from "./AddNewAddress";
import { useLocation, useNavigate } from "react-router-dom";
import {
    addOnlineOrder,
    decrementCartQuantity,
    getCurrentUserCartProducts,
    getDeliveryAddress,
    incrementCartQuantity,
    removeSoloFromCart,
} from "../../helper/api/apiHelper";
import _ from "lodash";
import LoadingScreen from "../../components/LoadingScreen";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

const Delivery = () => {
    const [changeRight, setChangeRight] = useState(false);
    const location = useLocation();
    const [allDeliveryAddress, setAllDeliveryAddress] = useState([]);
    const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingPlaceOrder, setLoadingPlaceOrder] = useState(false);
    // const [dummy, setDummy] = useState(false);
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [cartData, setCartData] = useState([]);

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            let order_ref = "online_order";
            setLoading(true);
            let formdatas = {
                order_ref: order_ref,
                bookingref: _.get(location, "state.table_details._id", ""),
            };
            const result = await getCurrentUserCartProducts(
                JSON.stringify(formdatas)
            );
            setCartData(_.get(result, "data.data", []));
            const address = await getDeliveryAddress();
            setAllDeliveryAddress(_.get(address, "data.data", []));
            setSelectedDeliveryAddress(_.get(address, "data.data[0]", []));
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
            return notification.error({ message: "Something went wrong" });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getSingleItemTotalPrice = (id) => {
        try {
            let filters = cartData.filter((res) => {
                return id === res._id;
            });

            return (
                _.get(filters, "[0].productRef.discountPrice", 0) *
                _.get(filters, "[0].quantity", 0)
            );
        } catch (err) {
            notification.error({ message: "Something went wrong" });
        }
    };

    const handlePlaceOrder = async () => {
        try {
            setLoadingPlaceOrder(true);

            let food_data = cartData.map((res) => {
                return {
                    pic: _.get(res, "productRef.image", ""),
                    foodName: _.get(res, "productRef.name", ""),
                    foodPrice: _.get(res, "productRef.price", ""),
                    originalPrice: _.get(res, "productRef.discountPrice", ""),
                    foodQuantity: _.get(res, "quantity", ""),
                };
            });

            let formData = {
                customerName: _.get(selectedDeliveryAddress, "name", ""),
                mobileNumber: _.get(
                    selectedDeliveryAddress,
                    "mobileNumber",
                    ""
                ),
                billAmount: _.get(getTotalAmount(), "Total_amount", 0),
                gst: _.get(getTotalAmount(), "gstPrice", 0),
                delivery_charge: _.get(
                    getTotalAmount(),
                    "deliverCharagePrice",
                    0
                ),
                packing_charge: _.get(getTotalAmount(), "packingPrice", 0),
                transaction_charge: _.get(
                    getTotalAmount(),
                    "transactionPrice",
                    0
                ),
                coupon_amount: _.get(getTotalAmount(), "couponDiscount", 0),
                item_price: _.get(getTotalAmount(), "itemPrice", 0),
                orderedFood: food_data,
                location: selectedDeliveryAddress,
                orderId:
                    "BIPL031023" +
                    uuidv4()?.slice(0, 4)?.toUpperCase() +
                    moment(new Date()).format("DMy"),
            };
            await addOnlineOrder(formData);
            notification.success({
                message: "Your order has been successfully placed.",
            });
            navigate("/profile-online-order");
        } catch (err) {
            notification.error({ message: "Something went wrong" });
        } finally {
            setLoadingPlaceOrder(false);
        }
    };

    const handleIncement = async (id) => {
        try {
            await incrementCartQuantity(id);
            message.success("quantity updated");
            fetchData();
        } catch (err) {
            console.log(err);
        }
    };
    const handleClickDecrement = async (id, count) => {
        try {
            if (count > 1) {
                await decrementCartQuantity(id);
                message.success("quantity updated");
            } else {
                await removeSoloFromCart(id);
                message.success("Food removed from cart");
            }
            fetchData();
        } catch (err) {
            console.log(err);
        }
    };

    const getTotalAmount = () => {
        let itemPrice = _.sum(
            cartData.map((res) => {
                return (
                    Number(_.get(res, "productRef.discountPrice", "")) *
                    res.quantity
                );
            })
        );

        let itemdiscountPrice = _.sum(
            cartData.map((res) => {
                return (
                    Number(_.get(res, "productRef.price", "")) * res.quantity
                );
            })
        );

        let total_qty = _.sum(
            cartData.map((res) => {
                return res.quantity;
            })
        );

        let gstPrice = (itemPrice * 5) / 100;
        let deliverCharagePrice = 50;
        let packingPrice = (itemPrice * 10) / 100;
        let transactionPrice = (itemPrice * 5) / 100;
        let couponDiscount = 0;

        let total_amount =
            itemPrice +
            gstPrice +
            deliverCharagePrice +
            packingPrice +
            transactionPrice -
            couponDiscount;

        let total_for_dining = itemPrice + gstPrice;
        let total_dc_price =
            _.get(location, "pathname", "") !== "/dining-cart"
                ? total_for_dining - itemPrice + itemdiscountPrice
                : total_amount - itemPrice + itemdiscountPrice;

        return {
            total_amount: total_amount,
            itemPrice: itemPrice,
            gstPrice: gstPrice,
            deliverCharagePrice: deliverCharagePrice,
            packingPrice: packingPrice,
            transactionPrice: transactionPrice,
            couponDiscount: couponDiscount,
            Total_amount: total_amount,
            total_for_dining: total_for_dining,
            total_qty: total_qty,
            itemdiscountPrice: total_dc_price,
        };
    };

    return loading ? (
        <div>
            <LoadingScreen />
        </div>
    ) : (
        <div className="min-h-screen">
            {_.isEmpty(allDeliveryAddress) ? (
                <div className="min-h-screen center_div">
                    <Empty
                        description={
                            <span>
                                You currently have no address
                                <br /> add a new one by clicking this link.
                                <span
                                    onClick={() => {
                                        setChangeRight(true);
                                        setOpen(true);
                                    }}
                                    className="text-blue-500 cursor-pointer"
                                >
                                    &nbsp;here
                                </span>
                            </span>
                        }
                    />
                </div>
            ) : (
                <div className="w-screen min-h-screen lg:px-20 px-2 bg-[#ededed] pb-28">
                    <div className="lg:pt-14 pt-10">
                        <div className="font-bold lg:text-5xl  text-[#3A3A3A] tracking-wider">
                            Your food cart
                        </div>
                        <img
                            src="/assets/icons/orderborder.png"
                            alt=""
                            className="w-[70px] h-[5px]"
                        />
                    </div>

                    {/* items */}
                    <div className="flex justify-between items-start lg:pt-14 pt-8 lg:flex-row flex-col-reverse gap-y-8">
                        {/* left */}
                        {/* allDeliveryAddress */}

                        <div className="flex flex-col gap-y-6 w-full">
                            <div className="flex flex-col gap-y-6 w-full">
                                <div className="text-dark3a_color font-semibold lg:text-2xl">
                                    Select delivery address
                                </div>
                                {/* address */}
                                <div className="lg:w-[450px] w-full min-h-[200px] gap-y-3 flex flex-col bg-white shadow-2xl shadow-[#00000040] rounded-2xl relative ">
                                    <div className="flex justify-between items-center p-4">
                                        <div className="font-semibold text-dark3a_color text-sm">
                                            Delivery to this address
                                        </div>
                                        <div
                                            onClick={() => {
                                                setOpen(true);
                                                setChangeRight(false);
                                            }}
                                            className="bg-[#FFE5E5] w-fit lg:px-3 py-1 px-2 font-bold  text-red_color rounded-lg absolute right-3 cursor-pointer lg:text-sm text-[10px]"
                                        >
                                            Change
                                        </div>
                                    </div>
                                    <address className="text-[#494949] capitalize font-normal pl-4 line-clamp-3 lg:text-lg text-sm lg:w-[90%]">
                                        {_.get(
                                            selectedDeliveryAddress,
                                            "name",
                                            ""
                                        )}
                                        ,&nbsp;
                                        {_.get(
                                            selectedDeliveryAddress,
                                            "streetName",
                                            ""
                                        )}
                                        ,&nbsp;
                                        {_.get(
                                            selectedDeliveryAddress,
                                            "landMark",
                                            ""
                                        )}
                                        ,&nbsp;
                                        {_.get(
                                            selectedDeliveryAddress,
                                            "city",
                                            ""
                                        )}
                                        -
                                        {_.get(
                                            selectedDeliveryAddress,
                                            "picCode",
                                            ""
                                        )}
                                    </address>
                                    <div className="text-green_color pl-4 pb-20 text-sm">
                                        Estimate time 30 min
                                    </div>
                                    {/* button */}
                                    <div className="w-full h-[60px] bg-dark3a_color center_div absolute bottom-0 rounded-b-2xl text-white">
                                        Delivery here
                                    </div>
                                </div>
                                {/* new address */}
                                <div
                                    onClick={() => {
                                        setChangeRight(true);
                                        setOpen(true);
                                    }}
                                    className="lg:w-[450px] w-full min-h-[100px] cursor-pointer bg-white border shadow-2xl shadow-[#00000040] rounded-2xl gap-x-5 center_div justify-start px-10"
                                >
                                    <div className="lg:w-[80px] lg:h-[80px] rounded-full center_div">
                                        <img
                                            src="/assets/icons/addresslocation.png"
                                            alt=""
                                            className="lg:w-[30px] w-[20px]"
                                        />
                                    </div>
                                    <div className="font-medium text-dark3a_color lg:text-xl">
                                        Add another address
                                    </div>
                                </div>
                                {/* proceed button */}
                                <div
                                    onClick={() => setOpenModal(true)}
                                    className="lg:w-[450px] h-[80px] center_div bg-yellow_color  cursor-pointer  rounded-2xl text-[#EFEFEF] lg:text-xl font-semibold"
                                >
                                    Proceed & Continue to pay
                                </div>
                            </div>
                        </div>

                        {/* right */}

                        <div className="lg:w-[70%] w-full lg:h-[600px] overflow-y-scroll bg-white rounded-2xl lg:px-10 pt-0 flex flex-col gap-y-2 pb-10 px-2">
                            {/* foods */}
                            <div className="flex flex-col gap-y-2 pt-4">
                                {cartData.map((res, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center gap-x-10 lg:w-[500px] w-full lg:flex-row flex-col lg:shadow-none shadow-lg rounded-lg lg:py-0 py-5 bg-white"
                                        >
                                            {/* food picture */}

                                            <img
                                                src={_.get(
                                                    res,
                                                    "productRef.image",
                                                    ""
                                                )}
                                                alt=""
                                                className="lg:!w-[60px] lg:h-[50px] rounded-lg !w-full object-cover"
                                            />

                                            {/* name icn/dec button */}
                                            <div className="flex lg:flex-col flex-row w-full justify-between gap-y-1 lg:w-[120px]  items-start px-2 py-4">
                                                <div className="text-[#3A3A3A] font-semibold lg:text-xl !overflow-hidden !text-ellipsis  lg:w-[120px]  line-clamp-1">
                                                    {_.get(
                                                        res,
                                                        "productRef.name",
                                                        ""
                                                    )}
                                                </div>
                                                <div className="flex gap-x-4">
                                                    <div
                                                        onClick={() => {
                                                            handleClickDecrement(
                                                                res._id,
                                                                _.get(
                                                                    res,
                                                                    "quantity",
                                                                    ""
                                                                )
                                                            );
                                                        }}
                                                        className={`bg-[#3A3A3A]  w-[25px] h-[25px] rounded-lg text-white center_div cursor-pointer`}
                                                    >
                                                        -
                                                    </div>
                                                    <div>
                                                        {_.get(
                                                            res,
                                                            "quantity",
                                                            ""
                                                        )}
                                                    </div>
                                                    <div
                                                        onClick={() => {
                                                            handleIncement(
                                                                res._id
                                                            );
                                                        }}
                                                        className="w-[25px] h-[25px] rounded-lg bg-yellow_color text-white center_div cursor-pointer"
                                                    >
                                                        +
                                                    </div>
                                                </div>
                                            </div>
                                            {/* count int */}
                                            <div className="flex justify-between w-full px-2">
                                                <div className="text-[#B6B6B6] w-[80px]  flex justify-start ">
                                                    {" "}
                                                    &times; &#8377;{" "}
                                                    {_.get(
                                                        res,
                                                        "productRef.discountPrice",
                                                        ""
                                                    )}
                                                </div>
                                                {/* price */}
                                                <div className="lg:text-lg text-[#3A3A3A] w-[100px] flex justify-end">
                                                    &#8377;{" "}
                                                    {getSingleItemTotalPrice(
                                                        res._id
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <Divider />
                            {/* price deatils */}
                            <div className="flex flex-col gap-y-6 pb-2">
                                {/* price */}
                                <h1 className="text-[#292929] lg:text-2xl font-semibold">
                                    Order summary
                                </h1>
                                <div className="flex  justify-between pt-4 border-b border-[#C1C1C1]">
                                    <div className="flex gap-x-2">
                                        <div className="text-[#3F3F3F] font-normal">
                                            Item price
                                        </div>{" "}
                                        <div className="text-[#B6B6B6]">
                                            {" "}
                                            &times;{" "}
                                            {_.get(
                                                getTotalAmount(),
                                                "total_qty",
                                                0
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-lg text-[#3A3A3A]">
                                        &#8377;{" "}
                                        {_.get(
                                            getTotalAmount(),
                                            "itemPrice",
                                            0
                                        )}
                                    </div>
                                </div>
                                {/* gst */}
                                <div className="flex  justify-between border-b border-[#C1C1C1] lg:text-lg text-sm">
                                    <div className="flex gap-x-2">
                                        <div className="text-[#3F3F3F] font-normal">
                                            Gst
                                        </div>{" "}
                                    </div>
                                    <div className=" text-[#3A3A3A]">
                                        &#8377;{" "}
                                        {_.get(getTotalAmount(), "gstPrice", 0)}
                                    </div>
                                </div>
                                {/* delivery charge */}
                                <div className="flex  justify-between border-b border-[#C1C1C1] lg:text-lg text-sm">
                                    <div className="flex gap-x-2">
                                        <div className="text-[#3F3F3F] font-normal">
                                            Delivery Charge
                                        </div>{" "}
                                    </div>
                                    <div className=" text-[#3A3A3A]">
                                        &#8377; 50
                                    </div>
                                </div>
                                {/* Packing charges */}
                                <div className="flex  justify-between border-b border-[#C1C1C1] lg:text-lg text-sm">
                                    <div className="flex gap-x-2">
                                        <div className="text-[#3F3F3F] font-normal">
                                            {" "}
                                            Packing Charges
                                        </div>{" "}
                                    </div>
                                    <div className=" text-[#3A3A3A]">
                                        &#8377;{" "}
                                        {_.get(
                                            getTotalAmount(),
                                            "packingPrice",
                                            0
                                        )}
                                    </div>
                                </div>
                                {/* Transaction charges */}
                                <div className="flex  justify-between border-b border-[#C1C1C1] lg:text-lg text-sm">
                                    <div className="flex gap-x-2">
                                        <div className="text-[#3F3F3F] font-normal">
                                            {" "}
                                            Transaction Charges
                                        </div>{" "}
                                    </div>
                                    <div className=" text-[#3A3A3A]">
                                        &#8377;{" "}
                                        {_.get(
                                            getTotalAmount(),
                                            "transactionPrice",
                                            0
                                        )}
                                    </div>
                                </div>
                                {/* Coupon discount */}
                                {/* <div className="flex  justify-between border-b border-[#C1C1C1] lg:text-lg text-sm">
                                    <div className="flex gap-x-2">
                                        <div className="text-[#3F3F3F] font-normal">
                                            Coupon discount
                                        </div>{" "}
                                    </div>
                                    <div className=" text-yellow_color font-medium">
                                        &#8377; 0
                                    </div>
                                </div> */}
                                {/* total amount */}
                                <div className="flex  justify-between pt-6">
                                    <div className="flex gap-x-2">
                                        <div className="text-[#3F3F3F] font-normal">
                                            Total Amount
                                        </div>{" "}
                                    </div>
                                    <div className="text-lg text-[#3A3A3A] font-medium flex items-center gap-x-2">
                                        <div className="text-[rgb(87,87,87)] relative text-red-500">
                                            &#8377;{" "}
                                            {_.get(
                                                getTotalAmount(),
                                                `itemdiscountPrice`,
                                                0
                                            )}
                                            <img
                                                src="/assets/icons/linecross.png"
                                                alt=""
                                                className="absolute top-1"
                                            />
                                        </div>

                                        <div className="text-green-500 font-bold">
                                            &#8377;
                                            {_.get(
                                                getTotalAmount(),
                                                "Total_amount",
                                                0
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Drawer
                title="Select Your Address"
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                destroyOnClose
                width={500}
            >
                <div className="lg:px-10 px-4">
                    {changeRight ? (
                        <AddNewAddress
                            setChangeRight={setChangeRight}
                            setOpen={setOpen}
                            changeRight={changeRight}
                            fetchData={fetchData}
                        />
                    ) : (
                        <div className="flex flex-col gap-y-4">
                            {allDeliveryAddress.map((res, index) => {
                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setSelectedDeliveryAddress(res);
                                            setOpen(false);
                                        }}
                                        className={`break-words min-h-[100px] capitalize center_div justify-start pl-4 lg:text-lg   rounded-lg cursor-pointer ${
                                            _.get(
                                                selectedDeliveryAddress,
                                                "_id",
                                                false
                                            ) === res._id
                                                ? "!bg-green-500 text-white"
                                                : "bg-slate-100"
                                        }`}
                                    >
                                        {_.get(res, "name", "")},&nbsp;
                                        {_.get(res, "streetName", "")},&nbsp;
                                        {_.get(res, "landMark", "")},&nbsp;
                                        {_.get(res, "city", "")}-
                                        {_.get(res, "picCode", "")}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </Drawer>
            <Modal
                open={openModal}
                className="bg-black rounded-2xl"
                closable={false}
                footer={false}
                onCancel={() => {
                    setOpenModal(false);
                }}
            >
                <div className="flex flex-col gap-y-10 justify-start pt-4">
                    <Radio value={1} checked={true} className="!text-white">
                        Cash On Delivery
                    </Radio>
                    <Radio disabled className="!text-white">
                        Credit / Debit / ATM Card
                    </Radio>
                    <Radio disabled className="!text-white">
                        Net Banking
                    </Radio>
                    <Button
                        onClick={handlePlaceOrder}
                        loading={loadingPlaceOrder}
                        className=" hover:!text-white min-w-[200px] center_div border-none min-h-[50px] text-md bg-primary_color rounded-lg text-white mt-10"
                    >
                        Place Order
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default Delivery;
