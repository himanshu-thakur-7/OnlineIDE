import Select from "react-tailwindcss-select";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import SnackBar from "../widgets/Snackbar";
import axios from "axios";
import { generateSlug } from "random-word-slugs";

// import Loader from "../widgets/Loader";
const options = [
    { value: "nodejs", label: "🚀 Nodejs" },
    { value: "python", label: "🐍 Python" },

];

const URL = "http://localhost:8000/project"

const HomePage = () => {
    const navigate = useNavigate();
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [env, setEnv] = useState(null);

    const createEnv = async () => {
        console.log('hi');
        if (!env) {
            setShowSnackBar(true);
        }
        else {

            const slug = generateSlug(3);
            navigate(`/codingPage/${slug}`, {
                state: env.value
            })
        }
    }

    useEffect(() => {
        if (showSnackBar) {
            setTimeout(() => {
                setShowSnackBar(false)
            }, 3000)
        }
    }, [showSnackBar]);

    const handleChange = value => {
        console.log("value:", value);
        setEnv(value);
    };
    return <div className=' bg-cyan-950 h-screen text-yellow-100 flex items-center'>
        <div className="p-4  mx-auto text-center w-72">
            <Select
                placeholder="Select Environment"
                value={env}
                onChange={handleChange}
                options={options}
                isSearchable={true}
            />
            <div className="my-4">
                <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" onClick={createEnv}>
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Create Environment
                    </span>
                </button>
            </div>
            {/* <Loader /> */}
            {showSnackBar ? <SnackBar /> : <div></div>}
        </div>

    </div>
}

export default HomePage;