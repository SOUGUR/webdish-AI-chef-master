import { BiDish } from "react-icons/bi";

const Overview = ({ form, color, value, open, setOpen, page }) => {
  return (
    <div className={`lg:max-w-[75%] mx-auto flex flex-col justify-center items-center font-primary ${color} py-10 px-1 lg:px-8`}>
      {value == "searchPage" ? (
        <button
          className="custom-btn px-4 py-1 rounded-md text-xl"
          onClick={() => {
            document.body.style.overflow = "";
            setOpen(false);
          }}
        >
          Back
        </button>
      ) : (
        <></>
      )}
      <p className="text-3xl text-center font-semibold text-amber-500 pb-4 flex items-center justify-center gap-4">
        Dish Overview <BiDish />
      </p>
      <div className="custom-text w-full">
        <div className="flex items-center gap-4 border-b border-zinc-500">
          <p className="p-1  py-2 font-semibold lg:text-xl">Dish Name - </p>{" "}
          <span className="text-lg capitalize">{form.name}</span>
        </div>
        <div className="flex items-center gap-4 border-b border-zinc-500">
          <p className="p-1  py-2 font-semibold lg:text-xl">
            Veg or Non-veg -{" "}
          </p>
          <span className="text-lg ">{form.veg_non_veg}</span>
        </div>
        {form.popularity_state && (
          <div className="flex items-center gap-4 border-b border-zinc-500">
            <p className="p-1 py-2 font-semibold lg:text-xl">
              Popularity state -{" "}
            </p>
            <span className=" text-lg"> {form.popularity_state}</span>
          </div>
        )}
        <div className="flex items-center gap-4 border-b border-zinc-500">
          <p className="p-1  py-2 font-semibold lg:text-xl">Cuisine - </p>{" "}
          <span className="text-lg "> {form.cuisine}</span>
        </div>
        <div className="flex items-center gap-4 border-b border-zinc-500">
          <p className="p-1  py-2 font-semibold lg:text-xl">
            Kitchen Equipments -{" "}
          </p>{" "}
          <div>
            {form.kitchen_equipments && form.kitchen_equipments.map((equipment, index) => (
              <span className="text-lg" key={index}>
                {equipment}{form?.kitchen_equipments?.length !== index + 1 && ", "}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4 border-b border-zinc-500">
          <p className="p-1 py-2 font-semibold lg:text-xl">Course Types - </p>
          <div className="p-1 py-2">
            {form?.courses?.map((type, index) => (
              <span key={index} className="text-lg">
                {type.name}{form?.courses?.length !== index + 1 && ", "}
              </span>
            )
            )}
          </div>
        </div>

        {form?.instructions?.length > 0 && (
          <div className="flex items-center gap-4 border-b border-zinc-500">
            <p className="p-1 py-2 font-semibold lg:text-xl">Cooking time - </p>
            <span className=" text-lg">{form.cooking_time} min</span>
          </div>
        )}

        {form?.ingredients?.length > 0 || form?.instructions?.length > 0 ? (
          <div className="p-1 border-b border-zinc-500 py-2  gap-4">
            {Array.from({ length: 5 }, (_, portion) => (
              <div key={portion} className="portion">
                <h3 className="font-bold text-xl pt-2 underline">Portion {portion + 1}</h3>
                {form?.ingredients?.length > 0 && (
                  <>
                    <p className="font-semibold text-lg">Ingredient</p>
                    <ul>
                      {form?.ingredients?.map((ingredient, ingredientIndex) => (
                        <li key={ingredientIndex} className="text-lg">
                          {ingredientIndex + 1}. {ingredient.name}- {ingredient.quantity[portion]} {ingredient.unit}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {form?.instructions?.length > 0 && (
                  <>
                    <p className="font-semibold text-lg">Instruction</p>
                    <ol>
                      {form?.instructions?.map((instruction, instructionIndex) => (
                        <li key={instructionIndex} className="text-lg">
                          {instructionIndex + 1}. {instruction.step}- {instruction.time[portion]} min
                        </li>
                      ))}
                    </ol>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Overview;


// import React, { useState } from "react";
// import { BiDish } from "react-icons/bi";
// import translate from "@vitalets/google-translate-api"; // Import translation library

// const Overview = ({ form, color, value, open, setOpen, page }) => {
//   const [translatedForm, setTranslatedForm] = useState(form);
//   const [isTranslating, setIsTranslating] = useState(false);

//   // Function to translate text to English
//   const translateToEnglish = async (text) => {
//     try {
//       const res = await translate(text, { to: 'en' });
//       return res.text;
//     } catch (error) {
//       console.error("Translation error:", error);
//       return text; // If translation fails, return original text
//     }
//   };

//   // Handle the translation of form fields
//   const handleTranslate = async () => {
//     setIsTranslating(true);

//     // Translate each field in form data
//     const translatedData = {
//       ...translatedForm,
//       name: await translateToEnglish(form.name),
//       veg_non_veg: await translateToEnglish(form.veg_non_veg),
//       popularity_state: form.popularity_state
//         ? await translateToEnglish(form.popularity_state)
//         : "",
//       cuisine: await translateToEnglish(form.cuisine),
//       kitchen_equipments: await Promise.all(
//         form.kitchen_equipments.map((equipment) =>
//           translateToEnglish(equipment)
//         )
//       ),
//       courses: await Promise.all(
//         form.courses.map((course) => translateToEnglish(course.name))
//       ),
//       ingredients: form.ingredients.map(async (ingredient) => ({
//         ...ingredient,
//         name: await translateToEnglish(ingredient.name),
//       })),
//       instructions: form.instructions.map(async (instruction) => ({
//         ...instruction,
//         step: await translateToEnglish(instruction.step),
//       })),
//     };

//     setTranslatedForm(translatedData);
//     setIsTranslating(false);
//   };

//   return (
//     <div
//       className={`lg:max-w-[75%] mx-auto flex flex-col justify-center items-center font-primary ${color} py-10 px-1 lg:px-8`}
//     >
//       {value === "searchPage" && (
//         <button
//           className="custom-btn px-4 py-1 rounded-md text-xl"
//           onClick={() => {
//             document.body.style.overflow = "";
//             setOpen(false);
//           }}
//         >
//           Back
//         </button>
//       )}
//       <p className="text-3xl text-center font-semibold text-amber-500 pb-4 flex items-center justify-center gap-4">
//         Dish Overview <BiDish />
//       </p>

//       <button
//         className="custom-btn mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
//         onClick={handleTranslate}
//         disabled={isTranslating}
//       >
//         {isTranslating ? "Translating..." : "Check (Translate to English)"}
//       </button>

//       <div className="custom-text w-full mt-6">
//         <div className="flex items-center gap-4 border-b border-zinc-500">
//           <p className="p-1  py-2 font-semibold lg:text-xl">Dish Name - </p>
//           <span className="text-lg capitalize">{translatedForm.name}</span>
//         </div>
//         <div className="flex items-center gap-4 border-b border-zinc-500">
//           <p className="p-1  py-2 font-semibold lg:text-xl">Veg or Non-veg -</p>
//           <span className="text-lg ">{translatedForm.veg_non_veg}</span>
//         </div>
//         {translatedForm.popularity_state && (
//           <div className="flex items-center gap-4 border-b border-zinc-500">
//             <p className="p-1 py-2 font-semibold lg:text-xl">
//               Popularity state -
//             </p>
//             <span className=" text-lg">{translatedForm.popularity_state}</span>
//           </div>
//         )}
//         <div className="flex items-center gap-4 border-b border-zinc-500">
//           <p className="p-1  py-2 font-semibold lg:text-xl">Cuisine -</p>
//           <span className="text-lg ">{translatedForm.cuisine}</span>
//         </div>

//         <div className="flex items-center gap-4 border-b border-zinc-500">
//           <p className="p-1 py-2 font-semibold lg:text-xl">
//             Kitchen Equipments -
//           </p>
//           <div>
//             {translatedForm.kitchen_equipments &&
//               translatedForm.kitchen_equipments.map((equipment, index) => (
//                 <span className="text-lg" key={index}>
//                   {equipment}
//                   {form.kitchen_equipments.length !== index + 1 && ", "}
//                 </span>
//               ))}
//           </div>
//         </div>

//         {/* Other sections remain the same */}

//       </div>
//     </div>
//   );
// };

// export default Overview;
