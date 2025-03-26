import { Link, useNavigate } from "react-router";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignupSchema } from "../schemas/authSchema";
import ToolTipMessage from "../components/Common/ToolTipMessage";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { axiosInstance } from "../utils/axiosInstance";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Signup = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState("");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset
    } = useForm({
        resolver: yupResolver(SignupSchema),
        mode: "onChange"
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Loading...");

        try {
            const response = await axiosInstance.post("/auth/signup", data);
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/login");
                reset();
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response.data.message);
            }
        } finally {
            setIsSubmitting(false);
            toast.dismiss(toastId);
        }
    };

    return (
        <div className="h-full flex gap-10 items-center justify-center flex-1 my-14 mx-5">
            <div>
                <img
                    src="/assets/signup.jpg"
                    className="block mx-auto w-[448px] rounded-xl"
                    loading="lazy"
                    alt="login-img"
                />
            </div>
            <div className="max-w-md w-full">
                <h2 className="card-title justify-center text-2xl mt-8">Create an Account</h2>
                <form
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    className="card-body">
                    <div className="space-y-5">
                        <div className="relative">
                            <label className="floating-label">
                                <span className={`${errors?.name && "text-red-500"}`}>Name</span>
                                <input
                                    type="text"
                                    {...register("name")}
                                    placeholder="Name"
                                    className={`input w-full h-13 focus:outline-0 focus-within:outline-0 ${errors?.name && "border-red-500"}`}
                                />
                            </label>
                            {errors?.name && <ToolTipMessage message={errors.name.message} />}
                        </div>
                        <div className="relative">
                            <label className="floating-label">
                                <span className={`${errors?.email && "text-red-500"}`}>Email Address</span>
                                <input
                                    type="email"
                                    {...register("email")}
                                    placeholder="Email Address"
                                    className={`input w-full h-13 focus:outline-0 focus-within:outline-0 ${errors?.email && "border-red-500"}`}
                                />
                            </label>
                            {errors?.email && <ToolTipMessage message={errors.email.message} />}
                        </div>
                        <div className="relative">
                            <label className="floating-label">
                                <span className={`${errors?.password && "text-red-500"}`}>Password</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    placeholder="Password"
                                    className={`input w-full h-13 focus:outline-0 focus-within:outline-0 ${errors?.password && "border-red-500"}`}
                                />
                            </label>
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 -translate-y-1/2 right-10 text-base cursor-pointer text-primary">
                                {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                            </span>
                            {errors?.password && <ToolTipMessage message={errors.password.message} />}
                        </div>
                    </div>
                    <div className="flex items-center flex-col gap-3 my-4">
                        <p className="m-auto cursor-pointer font-light">
                            Already Registered ?{" "}
                            <Link
                                to="/login"
                                className="font-semibold">
                                Log In
                            </Link>
                        </p>
                        <button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="btn btn-primary w-full h-11">
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <AiOutlineLoading3Quarters className="animate animate-spin text-lg" />
                                    Processing...
                                </div>
                            ) : (
                                "Signup"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
