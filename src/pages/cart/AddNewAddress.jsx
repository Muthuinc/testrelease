/* eslint-disable react/prop-types */
import { Button, Form, Input, Skeleton, notification } from "antd";
import { memo, useEffect, useState } from "react";
import {
    addDeliveryAddress,
    tokenVerification,
} from "../../helper/api/apiHelper";
import _ from "lodash";
import { PhoneInput } from "react-international-phone";
import { phoneNumberValidation } from "../../helper/validation";

const AddNewAddress = ({
    setChangeRight,
    changeRight,
    fetchData,
    setOpen,
    updateId = "",
}) => {
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);

    const [userDetail, setUserDetail] = useState("");

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const result = await tokenVerification();
            setUserDetail(_.get(result, "data.data", []));

            // form.setFieldsValue({
            //     user: _.get(result, "data.data.[0].user", ""),
            // });
        } catch (err) {
            return notification.error({ message: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (updateId) {
            form.setFieldsValue({ name: updateId?.user });
            form.setFieldsValue({ mobileNumber: updateId?.mobileNumber });
            form.setFieldsValue(updateId);
        }
    }, [updateId]);

    const handleFinish = async (values) => {
        try {
            setLoading(true);
            if (updateId) {
                return console.log(values);
            } else {
                await addDeliveryAddress(values);
            }
            setChangeRight(!changeRight);
            fetchData();
            setOpen(false);
            notification.success({
                message: "The address has been added successfully",
            });
        } catch (err) {
            notification.error({ message: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Skeleton
            active
            loading={loading}
            className="!w-[500px] !min-h-[400px]  !rounded-2xl"
        >
            <div className="lg:w-[500px] w-full min-h-[400px] bg-white rounded-2xl   relative pb-10">
                <div>
                    <div className="text-dark3a_color font-semibold lg:text-2xl tracking-wider pt-2">
                        Add your address
                    </div>
                    <Form className="pt-4" form={form} onFinish={handleFinish}>
                        <div className="flex flex-col gap-y-2">
                            <div className="text-dark3a_color  font-medium lg:text-lg">
                                Contact information
                            </div>

                            <Form.Item
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Enter Your Name",
                                    },
                                ]}
                            >
                                <Input
                                    className="antd_input"
                                    placeholder="Your name"
                                />
                            </Form.Item>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: null,
                                    },
                                    {
                                        validator: (_, value) =>
                                            phoneNumberValidation(
                                                "Enter your phone number",
                                                value
                                            ),
                                    },
                                ]}
                                name="mobileNumber"
                                className=" lg:w-[400px] w-[98%]  h-[50px]"
                            >
                                <PhoneInput
                                    defaultCountry={"in"}
                                    inputStyle={{ background: "red" }}
                                    className="!w-full !bg-white"
                                />
                            </Form.Item>
                        </div>
                        <div className="flex flex-col gap-y-2 w-full">
                            <div className="text-dark3a_color  font-medium lg:text-lg">
                                Delivery address
                            </div>
                            <div className="flex gap-x-2 flex-col">
                                <Form.Item
                                    name="streetName"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Enter Door / Flat no, Street name",
                                        },
                                    ]}
                                >
                                    {/* <div className="booking_input lg:w-[400px] w-full h-[40px]"> */}
                                    <Input
                                        className="antd_input "
                                        placeholder="Door / Flat no, Street name"
                                    />
                                    {/* </div> */}
                                </Form.Item>
                                <Form.Item
                                    name="landMark"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Enter Area name / Landmark",
                                        },
                                    ]}
                                >
                                    <Input
                                        className="antd_input "
                                        placeholder="Area name / Landmark"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="city"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Enter Your City",
                                        },
                                    ]}
                                >
                                    <Input
                                        className="antd_input "
                                        placeholder="City"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="picCode"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Enter Your Pin code",
                                        },
                                    ]}
                                >
                                    <Input
                                        className="antd_input "
                                        placeholder="Pin code"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="customerState"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Enter Your State",
                                        },
                                    ]}
                                >
                                    <Input
                                        className="antd_input "
                                        placeholder="State"
                                    />
                                </Form.Item>

                                {/* <img
                  src="/assets/images/map.png"
                  alt=""
                  className="lg:!w-[400px]"
                /> */}
                            </div>
                        </div>
                        <div className="lg:w-[400px] center_div pt-10">
                            <Button
                                htmlType="submit"
                                loading={loading}
                                className="!border-none !bg-yellow_color !w-[400px] !h-[50px] !rounded-2xl"
                            >
                                <div className="text-[#EFEFEF] font-semibold">
                                    Save & proceed
                                </div>
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </Skeleton>
    );
};

export default memo(AddNewAddress);
