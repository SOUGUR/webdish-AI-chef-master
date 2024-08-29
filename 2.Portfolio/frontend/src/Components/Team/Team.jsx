// Team.jsx
import React from "react";
// import TeamMember from "./TeamMember";
import pp from "./PP.jpg";
import sg from "./SG.jpg";
import ss from "./sk.jpeg";
import "./Team.css";

const teamMembers = [
  {
    imageSrc: pp,
    heading: "Prem Patil",
    pos: "CEO",
    likedIn: "https://www.linkedin.com/in/prem-patil143/",
    edu: "Education: Bachelor of Science (IT)",
    desc: "The heart and Soul of the Company his Imagination brings this idea into reality",
  },
  {
    imageSrc: sg,
    heading: "Shefali Goyal",
    pos: "COO",
    linkedIn: "https://www.linkedin.com/in/shefali-goyal-507a08211/",
    edu: "Education:- Bachelor of Technology (CSE)",
    desc: "Our COO handles the Operations activities just like a head of an Orchestra.",
  },
  {
    imageSrc: ss,
    heading: "Saurabh Kadam",
    pos: "CTO",
    linkedIn: "https://www.linkedin.com/in/saurabh-kadam6998/",
    edu: "Education:- Master Of Science (IT)",
    desc: "Our CTO is a Technology Wizard harmonizing innovation and strategy for the betterment of the Company.",
  },
];

const TeamMember = ({ imageSrc, heading, pos, edu, desc, linkedIn }) => (
  <div className='bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105'>
    <div className='relative h-96'>
      <div className='absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 transform -skew-y-6'></div>
      <div className='absolute inset-0 overflow-hidden'>
        <img 
          src={imageSrc} 
          alt={heading} 
          className='w-full h-full object-cover object-top clip-path-polygon'
        />
      </div>
    </div>
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{heading}</h2>
      <p className="text-lg font-semibold text-cyan-600 mb-1">{pos}</p>
      <p className="text-sm text-gray-600 mb-4">{edu}</p>
      <p className="text-gray-700 mb-4">{desc}</p>
      <a
        href={linkedIn}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-4 rounded-full font-semibold transition duration-300 hover:from-cyan-600 hover:to-blue-600"
      >
        Connect on LinkedIn
      </a>
    </div>
  </div>
);

const Team = () => {
  return (
    // <div className='p-6 min-h-screen w-full h-[90vh]'>
    //   <div className='flex justify-center items-center h-20 bg-cyan-600 border rounded-lg mb-4'>
    //     <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-white font-serif py-4'>
    //       OUR TEAM
    //     </h1>
    //   </div>
    //   <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 mb-5 place-content-center content-stretch'>
    //     {teamMembers.map((member, index) => (
    //       <TeamMember
    //         key={index}
    //         imageSrc={member.imageSrc}
    //         heading={member.heading}
    //         pos={member.pos}
    //         edu={member.edu}
    //         desc={member.desc}
    //         linkedIn={member.linkedIn}
    //       />
    //     ))}
    //   </div>
    // </div>

    // <div className="p-6 min-h-screen w-full bg-gray-100">
    //   <div className="max-w-7xl mx-auto">
    //     <div className="flex justify-center items-center h-24 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg shadow-lg mb-8">
    //       <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-serif py-4 tracking-wide">
    //         Our Team
    //       </h1>
    //     </div>
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-5">
    //       {teamMembers.map((member, index) => (
    //         <TeamMember
    //           key={index}
    //           imageSrc={member.imageSrc}
    //           heading={member.heading}
    //           pos={member.pos}
    //           edu={member.edu}
    //           desc={member.desc}
    //           linkedIn={member.linkedIn}
    //         />
    //       ))}
    //     </div>
    //   </div>
    // </div>

    <div className="p-6 min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-24 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg shadow-lg mb-12 transform -skew-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-serif py-4 tracking-wide skew-y-2">
            Our Team
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-5">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={index}
              imageSrc={member.imageSrc}
              heading={member.heading}
              pos={member.pos}
              edu={member.edu}
              desc={member.desc}
              linkedIn={member.linkedIn}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
