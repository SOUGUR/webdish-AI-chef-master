import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { FaMicrophone } from "react-icons/fa";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { MdArrowDropDown } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { translateAllText } from "./Translator";
import { BsCart3 } from "react-icons/bs";


const Flag = ({ countryFlag }) => (
  <img
    src={`https://flagcdn.com/${countryFlag.toLowerCase()}.svg`}
    alt={countryFlag}
    className="w-8"
  />
);

export default function NavBarHeader(props) {
  const location = useLocation();
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const [selectedLanguage, setSelectedLanguage] = useState("in");
  const [isLanguageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const categories = [
    { path: "/All-Indian-Dishes", label: "Indian Dishes" },
    { path: "/Luxury-Dishes", label: "Luxury Dishes" },
    { path: "/Quick-Dishes", label: "Quick Dishes" },
    { path: "/Healthy-Dishes", label: "Healthy Dishes" },
    { path: "/Create-Menu", label: "Create Menu" },
  ];

  const IndianLanguages = [
    { name: "English", code: "en" },
    { name: "Hindi", code: "hi" },
    { name: "Bengali", code: "bn" },
    { name: "Telugu", code: "te" },
    { name: "Marathi", code: "mr" },
    { name: "Tamil", code: "ta" },
    { name: "Urdu", code: "ur" },
    { name: "Gujarati", code: "gu" },
    { name: "Kannada", code: "kn" },
    { name: "Odia", code: "or" },
    { name: "Malayalam", code: "ml" },
    { name: "Punjabi", code: "pa" },
    { name: "Assamese", code: "as" },
    { name: "Maithili", code: "mai" },
    { name: "Santali", code: "sat" },
    { name: "Kashmiri", code: "ks" },
  ];

  const CountryFlag = [
    { countryName: "Indian", countryFlag: "in" },
    { countryName: "Spanish", countryFlag: "es" },
    { countryName: "Mexican", countryFlag: "mx" },
    { countryName: "French", countryFlag: "fr" },
    { countryName: "Italian", countryFlag: "it" },
  ];

  const selectLanguage = (countryFlag) => {
    setSelectedLanguage(countryFlag);
    setLanguageDropdownOpen(false);
  };
  const [selectedIndianLanguage, setSelectedIndianLanguage] = useState(
    sessionStorage.getItem("lang") ? sessionStorage.getItem("lang") : "EN"
  );
  const [indianDropdownOpen, setIndianDropdownOpen] = useState(false);

  const handleIndianLanguageSelect = async (languageCode) => {
    setSelectedIndianLanguage(languageCode);
    setIndianDropdownOpen(false);
    const elements = Array.from(document.body.querySelectorAll("*")).filter(
      (element) => element.childNodes.length > 0
    );
    sessionStorage.setItem("lang", languageCode);
    await translateAllText(elements, languageCode);
  };

  const toggleIndianDropdown = () => {
    setIndianDropdownOpen(!indianDropdownOpen);
  };

  useEffect(() => {
    setTimeout(() => {
      if (sessionStorage.getItem("lang")) {
        handleIndianLanguageSelect(sessionStorage.getItem("lang"));
      }
    }, 1500);
  }, []);

  const [showMenu, setShowMenu] = useState(false);

  async function recommend(text) {
    props.setDishes([]);
    if (text) {
      await fetch(`${import.meta.env.VITE_API_URL}/recommend_dishes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          query: text,
        }),
      }).then(async (e) => {
        let json = await e.json();
        props.setDishes(json);
      });
    }
  }

  return (
    <nav className="shadow-lg bg-[#00544f] md:px-2 text-white sticky top-0 z-50">
      <div className="flex justify-between mx-1 items-center h-16">
        <Link to="/" onClick={() => window.scrollTo(0, 0)}>
          <div className="flex items-center md:gap-1 lg:gap-3">
            <img
              className="h-14 rounded-lg w-auto navbar-logo"
              src="/assets/CompanyLogo.png"
              alt="LOGO"
            />
            <p className="text-lg font-bold md:text-sm leading-4 lg:text-lg">
              AI CHEF MASTER
            </p>
          </div>
        </Link>
        <div className="hidden md:flex overflow-hidden md:overflow-hidden ">
          <ul className="flex flex-shrink leading-4 md:gap-4 lg:gap-4 xl:gap-6 self-end items-center">
            <li className="text-base md:text-md">
              <Link to="/">Home</Link>
            </li>
            <li className="text-base md:text-md">
              <Link to="https://aichefmaster.com/aboutUs">About Us</Link>
            </li>

            <li className="flex items-center ">
              <div className="relative ">
                <div className="absolute inset-y-0 flex items-center px-3 pointer-events-none">
                  <FiSearch
                    size={25}
                    className="text-gray-500 dark:text-gray-400"
                  />
                </div>
                <input
                  type="search"
                  placeholder="Search recipes, dishes"
                  className="text-sm font-medium w-full md:w-32 lg:w-64 p-2 pl-10 rounded-md text-black focus:border-white focus:ring-white outline-none"
                  onChange={(e) => {
                    if (e.target.value) {
                      props.setSearch(e.target.value);
                      recommend(e.target.value);
                    } else {
                      props.setSearch("");
                    }
                  }}
                />

                <div className="absolute inset-y-0 right-2 flex items-center pr-3 pointer-events-none">
                  <FaMicrophone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
            </li>

            {/* <li className="flex items-center">
              <div className="mx-auto flex w-full items-center justify-center  ">
                <div className="group cursor-pointer py-2 text-base md:text-md">
                  <div className="flex items-center gap-1">
                    <Flag countryFlag={selectedLanguage} />
                    <div className="flex no-translate">
                      {selectedLanguage.toUpperCase()}
                      <MdArrowDropDown size={23} />
                    </div>
                  </div>
                  <div className="invisible absolute z-50  flex mx-auto flex-col bg-[#00544f] mt-2 py-1 px-4 text-white shadow-xl group-hover:visible no-translate">
                    {CountryFlag.map((country) => (
                      <div
                        key={country.countryFlag}
                        className="flex text-white pt-1 items-center gap-2 cursor-pointer"
                        onClick={() => selectLanguage(country.countryFlag)}
                      >
                        <Flag countryFlag={country.countryFlag} />
                        <span className="no-translate">{country.countryFlag.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </li> */}

            {/* {location.pathname !== "/" && (
              <li className="flex items-center gap-2">
                <div className="mx-auto flex w-full items-center justify-center  ">
                  <div className="group cursor-pointer py-2">
                    <div className="flex items-center justify-center">
                      <button
                        className="menu-hover items-center flex text-base md:text-md no-translate"
                        onClick={() => {}}
                      >
                        All
                        <MdArrowDropDown size={23} />
                      </button>
                    </div>
                    <div className="invisible absolute z-50 flex mx-auto flex-col bg-[#00544f] py-1 px-4 text-white shadow-xl group-hover:visible no-translate">
                      {categories.map(({ path, label }) => (
                        <Link
                          key={path}
                          to={path}
                          className={`hover:bg-[#007a72] rounded-md px-3 py-2 text-lg font-medium`}
                          onClick={() => handleCategoryClick(label)}
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            )} */}

            <li>
              <Link to="/Cart/"> <BsCart3 className="text-xl" /> </Link>
            </li>

            {!user && (
              <li className=" text-base md:text-md text-center">
                <Link to="/signup/"> Create Account</Link>
              </li>
            )}

            <li className="text-base  md:text-md flex items-center">
              <div className="mx-auto flex w-full items-center justify-center">
                <div
                  className="group cursor-pointer py-2 text-base md:text-md"
                  onClick={toggleIndianDropdown}
                >
                  <div className="flex items-center gap-1">
                    <div className="flex no-translate">
                      {selectedIndianLanguage.toUpperCase()}
                      <MdArrowDropDown size={23} />
                    </div>
                  </div>
                  <div
                    className={
                      "invisible absolute z-50  flex mx-auto flex-col bg-[#00544f] mt-2 py-1 px-4  text-white shadow-xl group-hover:visible no-translate"
                    }
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {IndianLanguages.map((lang) => (
                      <div
                        key={lang.code}
                        className="flex text-white pt-1 items-center rounded-md px-3 py-2 gap-2 cursor-pointer hover:bg-[#007a72] no-translate"
                        onClick={() => handleIndianLanguageSelect(lang.code)}
                      >
                        <span className="no-translate">{lang.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {indianDropdownOpen && (
                <div
                  className={
                    "invisible absolute z-50  flex mx-auto flex-col bg-[#00544f] mt-2 py-1 text-white shadow-xl group-hover:visible no-translate"
                  }
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {IndianLanguages.map((lang) => (
                    <div
                      key={lang.code}
                      className="flex text-white pt-1 items-center px-4 mb-1 gap-2 cursor-pointer hover:bg-[#007a72] no-translate"
                      onClick={() => handleIndianLanguageSelect(lang.code)}
                    >
                    <span className="no-translate">{lang.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </li>

            <li className="text-base md:text-md ">
              {" "}
              <Link className="flex items-center" to="/Settings">
                Setting
              </Link>
            </li>

            {user && (
              <li className="text-base md:text-md text-center">
                <button onClick={logout}>Logout</button>
              </li>
            )}
          </ul>
        </div>

        <div className="md:hidden">
          <button
            className="text-white font-extrabold p-2"
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? (
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

{/* ============================================================================================================================================= */}

      {showMenu && (
        <div className="md:hidden">
          <div className="px-4 py-2 flex flex-col">
            <ul className="flex gap-5 flex-col items-center justify-center">

            <li className="flex items-center ">
                <div className="relative ">
                  <div className="absolute inset-y-0 flex items-center px-2 pointer-events-none">
                    <FiSearch
                      size={25}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  </div>
                  <input
                    type="search"
                    placeholder="Search recipes, dishes"
                    className="text-sm font-medium w-full md:w-42 lg:w-64 p-2 px-9 rounded-md text-black focus:border-white focus:ring-white outline-none"
                    onChange={(e) => {
                      if (e.target.value) {
                        props.setSearch(e.target.value);
                        recommend(e.target.value);
                      } else {
                        props.setSearch("");
                      }
                    }}
                  />

                  <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
                    <FaMicrophone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
              </li>

              <li className="text-base md:text-md">
                <Link to="/" onClick={() => setShowMenu(false)}>
                  Home
                </Link>
              </li>
              <li className="text-base md:text-md">
                <Link to="/" onClick={() => setShowMenu(false)}>
                  About Us
                </Link>
              </li>

              {/* Language selection dropdown
              <li className="flex items-center">
                <div className="mx-auto flex w-full">
                  <div className="group cursor-pointer py-2 text-base md:text-md">
                    <div className="flex items-center gap-1">
                      <Flag countryFlag={selectedLanguage} />
                      <div className="flex">
                        {selectedLanguage.toUpperCase()}
                        <MdArrowDropDown size={23} />
                      </div>
                    </div>
                    <div className="invisible absolute z-50 flex mx-auto flex-col bg-[#00544f] mt-2 py-1 px-4 text-white shadow-xl group-hover:visible no-translate">
                      {CountryFlag.map((country) => (
                        <div
                          key={country.countryFlag}
                          className="flex text-white pt-1 items-center gap-2 cursor-pointer"
                          onClick={() => selectLanguage(country.countryFlag)}
                        >
                          <Flag countryFlag={country.countryFlag} />
                          <span className="no-translate">{country.countryFlag.toUpperCase()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </li> */}

              {/* {location.pathname !== "/" && (
              <li className="flex items-center gap-2">
                <div className="mx-auto flex w-full items-center justify-center  ">
                  <div className="group cursor-pointer py-2">
                    <div className="flex items-center justify-center">
                      <button
                        className="menu-hover items-center flex text-base md:text-md"
                        onClick={() => {}}
                      >
                        All
                        <MdArrowDropDown size={23} />
                      </button>
                    </div>
                    <div className="invisible absolute z-50 flex mx-auto flex-col bg-[#00544f] py-1 px-4 text-white shadow-xl group-hover:visible">
                      {categories.map(({ path, label }) => (
                        <Link
                          key={path}
                          to={path}
                          className={`hover:bg-[#007a72] rounded-md px-3 py-2 text-lg font-medium`}
                          onClick={() => handleCategoryClick(label)}
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            )} */}


              <li className="text-base  md:text-md flex items-center">
              <div className="mx-auto flex w-full">
                <div
                  className="group cursor-pointer py-2 text-base md:text-md"
                  onClick={toggleIndianDropdown}
                >
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {selectedIndianLanguage.toUpperCase()}
                      <MdArrowDropDown size={23} />
                    </div>
                  </div>
                  {indianDropdownOpen && (
                  <div
                    className={
                      "invisible absolute z-50  flex mx-auto flex-col bg-[#00544f] pl-8 pt-2 text-white shadow-xl group-hover:visible border-2 border-white-200"
                    }
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {IndianLanguages.map((lang) => (
                      <div
                        key={lang.code}
                        className="flex text-white pt-1 items-center rounded-md px-3 py-2 gap-2 cursor-pointer hover:bg-[#007a72] no-translate"
                        onClick={() => handleIndianLanguageSelect(lang.code)}
                      >
                        <span className="no-translate">{lang.name}</span>
                      </div>
                    ))}
                  </div>
                  )}
                </div>
              </div>
            </li>

            <li>
              <Link to="/Cart/" className="flex flex-row gap-2"> Cart <BsCart3 className="text-xl" /> </Link>
            </li>

            <li>
                <Link
                  to="/settings"
                  onClick={() => setShowMenu(false)}
                  className="text-base md:text-md flex items-center"
                >
                  Setting
                </Link>
              </li>

              {/* Conditional render for "Create Account" or "Logout" */}
              {!user ? (
                <li className="text-base md:text-md">
                  <Link to="/signup" onClick={() => setShowMenu(false)}>
                    Create Account
                  </Link>
                </li>
              ) : (
                <li className="text-base md:text-md">
                  <button
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                    }}
                  >
                    Logout
                  </button>
                </li>
              )}

            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}
