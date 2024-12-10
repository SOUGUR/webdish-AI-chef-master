import { FaInstagramSquare } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import './Footer.css'
const Footer = () => {
  return (
    <div className="footer rounded-0 bg-[#000000] text-white shadow-lg mt-0 golden-text">
      <div className="fluid-container items-center pt-12">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-3/12 md:w-4/12 sm:w-6/12 flex justify-center mb-5">
            <div className="footer-content">
              <h2 className="footer-heading">Company</h2>
              <ul className="list-items-styles">
                <li><a href="https://aichefmaster.com/aboutUs">About Us</a></li>
                <li><a href="https://aichefmaster.com/Team">Team</a></li>
                <li><a href="https://aichefmaster.com/job">Career</a></li>
                <li><a href="https://aichefmaster.com/blogs">Blogs</a></li>
                <li><a href="https://aichefmaster.com/news">News</a></li>
              </ul>
            </div>
          </div>

          <div className="w-full lg:w-3/12 md:w-4/12 sm:w-6/12 flex justify-center mb-5">
            <div className="footer-content">
              <h2 className="footer-heading">Contact</h2>
              <ul className="list-items-styles">
                <li><a href="mailto:info@aichefmaster.com?subject=Can%20you%20help%20">Help & Support</a></li>
              </ul>
            </div>
          </div>

          <div className="w-full lg:w-3/12 md:w-4/12 sm:w-6/12 flex justify-center mb-5">
            <div className="footer-content">
              <h2 className="footer-heading">Follow Us On</h2>
              <ul className="list-items-styles">
                <li className="flex items-center">
                  <div className="social">
                    <a href="https://www.instagram.com/aichefmaster_">
                      <span className="mr-2"><FaInstagramSquare style={{ color: '#C13584 ' }} /></span> <span>Instagram</span>
                    </a>
                  </div>
                </li>

                <li className="flex items-center">
                  <div className="social">
                    <a href="https://x.com/AIChefMaster">
                      <span className="mr-2"><BsTwitterX style={{ color: '#fff' }} /></span> <span>Twitter</span>
                    </a>
                  </div>
                </li>

                <li className="flex items-center">
                  <div className="social">
                    <a href="https://www.linkedin.com/company/aichefmaster/">
                      <span className="mr-2"><FaLinkedin style={{ color: '#0077b5' }} /></span> <span>LinkedIn</span>
                    </a>
                  </div>
                </li>

                <li className="flex items-center">
                  <div className="social">
                    <a href="https://www.facebook.com/profile.php?id=61557270956883&mibextid=ZbWKwL">
                      <span className="mr-2"><FaSquareFacebook style={{ color: '#00CED1' }} /></span> <span>Facebook</span>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <hr style={{ backgroundColor: "hsl(50, 33%, 30%)" }} className="w-full h-1 m-3" />

          <div className="w-full my-4">
            <p className="font-bold text-center">
              © 2024 All rights reserved by Premali Kitchen Private Limited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;