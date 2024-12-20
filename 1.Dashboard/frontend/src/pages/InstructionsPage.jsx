import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Overview from "../components/Overview";
import { AiOutlineClose } from "react-icons/ai";
import { useAuthContext } from "../hooks/useAuthContext";
import toast from "react-hot-toast";
import Ingredient from "./components/Ingredient";
import Instruction from "./components/Instruction";


const InstructionsPage = ({ setTab, formData, setFormData }) => {

    const navigate = useNavigate();
    const userToken = JSON.parse(localStorage.getItem("user"));
    const [allIngredients, setAllIngredients] = useState([]);
    const [trigger, setTrigger] = useState(false);

    const successInitialFormData = {
        name: "",
        veg_non_veg: "vegetarian",
        popularity_state: "",
        cuisine: "",
        course_type: [],
        cooking_time: "",
        ingredients: [],
        instructions: [],
        courses: [],
        description: "",
        kitchen_equipments: "",
    };

    const { user } = useAuthContext();
    const [open, setOpen] = useState(false);

    const [isLoading, setisLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const btnHandler = () => {
        if (formData.ingredients.length > 0) {
            const lastIngredient = formData.ingredients[formData.ingredients.length - 1];
            const missingPortions = lastIngredient.quantity.slice(1).reduce((acc, quantity, index) => {
                if (quantity === "") {
                    acc.push(index + 2);
                }
                return acc;
            }, []);

            if (missingPortions.length > 0) {
                const firstMissingPortionIndex = missingPortions[0];
                toast.error(`Please complete adding the quantity for portion ${firstMissingPortionIndex}`);
                return;
            }
        }
        if (formData.instructions.length > 0) {
            const lastInstruction = formData.instructions[formData.instructions.length - 1];
            const missingPortions = lastInstruction.time.slice(1).reduce((acc, time, index) => {
                if (time === "") {
                    acc.push(index + 2);
                }
                return acc;
            }, []);

            if (missingPortions.length > 0) {
                const firstMissingPortionIndex = missingPortions[0];
                toast.error(`Please complete adding the time for portion ${firstMissingPortionIndex}`);
                return;
            }
        }

        if (!open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        setOpen((prev) => !prev);
    };

    useEffect(() => {
        if (user && user.account_id) {
            const updatedFormData = { ...formData, chef: user.account_id };
            localStorage.setItem("formData", JSON.stringify(updatedFormData));
        }
    }, [formData]);

    useEffect(() => {
        console.log("Effect Start");
        console.log(formData.ingredients);
        console.log(allIngredients);
        if (trigger) {
            if (formData.ingredients.length > 0) {
                const lastIngredient = formData.ingredients[formData.ingredients.length - 1];
                const missingPortions = lastIngredient.quantity.slice(1).reduce((acc, quantity, index) => {
                    if (quantity === "") {
                        acc.push(index + 2);
                    }
                    return acc;
                }, []);

                if (missingPortions.length > 0) {
                    const firstMissingPortionIndex = missingPortions[0];
                    toast.error(`Please complete adding the quantity for portion ${firstMissingPortionIndex}`);
                    return;
                }
            }
            if (formData.instructions.length > 0) {
                const lastInstruction = formData.instructions[formData.instructions.length - 1];
                const missingPortions = lastInstruction.time.slice(1).reduce((acc, time, index) => {
                    if (time === "") {
                        acc.push(index + 2);
                    }
                    return acc;
                }, []);

                if (missingPortions.length > 0) {
                    const firstMissingPortionIndex = missingPortions[0];
                    toast.error(`Please complete adding the time for portion ${firstMissingPortionIndex}`);
                    return;
                }
            }

            setisLoading(true);

            const requiredFields = ["name", "veg_non_veg", "cuisine"];
            const arrayFields = ["ingredients", "instructions", "courses", "kitchen_equipments"];
            async function fetchData() {

                if (formData?.ingredients[0]) {
                    try {
                        const missingFields = requiredFields.filter(field => !formData[field]);
                        if (missingFields.length > 0 && formData.ingredients == []) {
                            toast.error(`Please fill in the following fields: ${missingFields.join(', ')}`);
                            setisLoading(false);
                            return;
                        }

                        const emptyArrayFields = arrayFields.filter(field => Array.isArray(formData[field]) && formData[field].length === 0);
                        if (emptyArrayFields.length > 0) {
                            if (allIngredients.length == 0) {
                                toast.error(`Please add items to the following fields: ${emptyArrayFields.join(', ')}`);
                                setisLoading(false);
                                return;
                            }
                        }
                        console.log("Saving...");
                        const response = await fetch(`${import.meta.env.VITE_API_URL}/chef/createDish`, {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${userToken.access_token}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(formData),
                        });

                        if (response.ok) {
                            setDisabled(true);
                            setisLoading(false);

                            localStorage.removeItem("stepData");

                            toast.success("Dish Created");
                            localStorage.removeItem("formData");
                            setFormData(successInitialFormData);
                            const backPage = () => {
                                setTimeout(() => {
                                    navigate('/history');
                                }, 2000);
                            };
                            backPage();
                        } else {
                            setisLoading(false);
                            setTrigger(false);
                            const errorData = await response.json();
                            toast.error(errorData.msg === "Token has expired" && "Signout and login again" || errorData.message || errorData.error || "Something went wrong");
                        }
                    } catch (error) {
                        setisLoading(false);
                        setTrigger(false);
                        toast.error("Something went wrong");
                    }
                }
            }
            fetchData();
        }
    }, [trigger]);

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log("start");
        console.log(allIngredients);
        console.log(allIngredients[0].length);
        console.log(allIngredients.length);

        let updatedFormData = { ...formData };

        if (allIngredients[0]) {
            const flattenedArray = allIngredients.flat();
            console.log("inside formdata.ingredients If");
            console.log(flattenedArray);
            updatedFormData = {
                ...formData,
                ingredients: flattenedArray
            };
            setFormData(updatedFormData);
            localStorage.setItem("formData", JSON.stringify(updatedFormData));
            setTrigger(true);
        }
        // await new Promise(resolve => setTimeout(resolve, 0));

    };

    useEffect(() => {
        const totalTime = formData.instructions.reduce((acc, instruction) => {
            const firstTimeValue = Array.isArray(instruction.time) && instruction.time.length > 0
                ? parseInt(instruction.time[0])
                : 0;
            return acc + firstTimeValue;
        }, 0);

        const updatedFormData = {
            ...formData,
            cooking_time: totalTime,
        };

        setFormData(updatedFormData);
        localStorage.setItem("formData", JSON.stringify(updatedFormData));
    }, [formData.instructions]);


    return (
        <>
            <div className="custom-bg shadow-xl p-0.5 w-[90%] lg:w-1/2 rounded-lg">
                <div className="items-center relative backdrop-filter backdrop-blur-xl rounded-lg">
                    <Ingredient
                        formData={formData}
                        setFormData={setFormData}
                        portion={1}
                    />
                    <Instruction
                        formData={formData}
                        setFormData={setFormData}
                        portion={1}
                        allIngredients={allIngredients}
                        setAllIngredients={setAllIngredients}
                    />
                </div>
            </div>

            <div className="custom-bg shadow-xl  p-0.5 w-[90%] lg:w-1/2 rounded-lg mt-5">
                <div className="items-center relative backdrop-filter backdrop-blur-xl rounded-lg">
                    <Ingredient
                        formData={formData}
                        setFormData={setFormData}
                        portion={2}
                    />
                    <Instruction
                        formData={formData}
                        setFormData={setFormData}
                        portion={2}
                        allIngredients={allIngredients}
                        setAllIngredients={setAllIngredients}
                    />
                </div>
            </div>

            <div className="custom-bg shadow-xl  p-0.5 w-[90%] lg:w-1/2 rounded-lg mt-5">
                <div className="items-center relative backdrop-filter backdrop-blur-xl rounded-lg">
                    <Ingredient
                        formData={formData}
                        setFormData={setFormData}
                        portion={3}
                    />
                    <Instruction
                        formData={formData}
                        setFormData={setFormData}
                        portion={3}
                        allIngredients={allIngredients}
                        setAllIngredients={setAllIngredients}
                    />
                </div>
            </div>

            <div className="custom-bg shadow-xl p-0.5 w-[90%] lg:w-1/2 rounded-lg mt-5">
                <div className="items-center relative backdrop-filter backdrop-blur-xl rounded-lg">
                    <Ingredient
                        formData={formData}
                        setFormData={setFormData}
                        portion={4}
                    />
                    <Instruction
                        formData={formData}
                        setFormData={setFormData}
                        portion={4}
                        allIngredients={allIngredients}
                        setAllIngredients={setAllIngredients}
                    />
                </div>
            </div>

            <div className="custom-bg shadow-xl p-0.5 w-[90%] lg:w-1/2 rounded-lg mt-5">
                <div className="items-center relative backdrop-filter backdrop-blur-xl rounded-lg">
                    <Ingredient
                        formData={formData}
                        setFormData={setFormData}
                        portion={5}
                    />
                    <Instruction
                        formData={formData}
                        setFormData={setFormData}
                        portion={5}
                        allIngredients={allIngredients}
                        setAllIngredients={setAllIngredients}
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-8">
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={btnHandler}
                        className="bg-blue-800 hover:bg-blue-900 px-4 py-2 overflow-hidden font-medium rounded-xl text-xl md:text-2xl"
                    >
                        <span className="text-white">Overview</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setTab(0)}
                        className="bg-zinc-800 hover:bg-zinc-900 group relative px-4 py-2 overflow-hidden font-medium rounded-xl text-xl md:text-2xl"
                    >
                        <span className="text-white">Back</span>
                    </button>
                </div>
                <button
                    onClick={submitHandler}
                    disabled={disabled || isLoading}
                    className={`${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'cursor-pointer bg-green-600 hover:bg-green-800'} px-4 py-2 overflow-hidden font-medium rounded-xl text-xl md:text-2xl`}
                >
                    <span className="text-white">
                        {isLoading ? "Creating" : "Submit"}
                    </span>
                </button>
            </div>

            {open && (
                <div className="fixed z-[3000] left-0 top-0 w-full h-[100dvh] flex items-center justify-center">
                    <div className="absolute top-0 z-[3001] w-full h-[100dvh] bg-black opacity-50" />
                    <div
                        className="custom-bg w-[90%] lg:w-1/2 max-h-[90vh] relative z-[3002] p-2 lg:p-0 overflow-y-auto">
                        <div className="absolute top-2.5 right-2.5 lg:top-5 lg:right-5">
                            <AiOutlineClose
                                onClick={btnHandler}
                                className="cursor-pointer text-3xl text-rose-600 border border-rose-500 p-1  hover:bg-rose-200 rounded-full"
                            />
                        </div>
                        <Overview form={formData} color={'text-black'} />
                    </div>
                </div>
            )}
        </>
    );
};

export default InstructionsPage;