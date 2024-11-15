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






// import { BiDish } from "react-icons/bi";
// import axios from "axios";
// import { useState } from "react";

// const Overview = ({ form, color, value, open, setOpen, submitHandler }) => {
//   const [translatedForm, setTranslatedForm] = useState(form);
//   const [isTranslating, setIsTranslating] = useState(false);
//   const [selectedPortion, setSelectedPortion] = useState(0);
//   const [translationError, setTranslationError] = useState("");

//   const getMaxPortions = () => {
//     const ingredientPortions = Math.max(
//       ...translatedForm.ingredients.map((ing) =>
//         Array.isArray(ing.quantity) ? ing.quantity.length : 1
//       )
//     );
//     const instructionPortions = Math.max(
//       ...translatedForm.instructions.map((inst) =>
//         Array.isArray(inst.time) ? inst.time.length : 1
//       )
//     );
//     return Math.max(ingredientPortions, instructionPortions);
//   };

//   const translateToEnglish = async (text) => {
//     if (!text) return text;
//     try {
//       const response = await axios.post(
//         "https://sebin35.pythonanywhere.com/translate_api",
//         {
//           text: text.toString(),
//           target_lang: "en",
//         }
//       );
//       return response.data.translated_text || text;
//     } catch (error) {
//       console.error("Translation failed:", error);
//       setTranslationError("Translation failed. Please try again.");
//       return text;
//     }
//   };

//   const handleTranslate = async () => {
//     setIsTranslating(true);
//     setTranslationError("");
//     try {
//       const translatedData = {
//         ...form,
//         name: await translateToEnglish(form.name),
//         veg_non_veg: await translateToEnglish(form.veg_non_veg),
//         popularity_state: form.popularity_state
//           ? await translateToEnglish(form.popularity_state)
//           : "",
//         cuisine: await translateToEnglish(form.cuisine),
//         kitchen_equipments: await Promise.all(
//           (form.kitchen_equipments || []).map(
//             async (equipment) => await translateToEnglish(equipment)
//           )
//         ),
//         courses: await Promise.all(
//           (form.courses || []).map(async (course) => ({
//             ...course,
//             name: await translateToEnglish(course.name),
//           }))
//         ),
//         ingredients: await Promise.all(
//           (form.ingredients || []).map(async (ingredient) => ({
//             ...ingredient,
//             name: await translateToEnglish(ingredient.name),
//           }))
//         ),
//         instructions: await Promise.all(
//           (form.instructions || []).map(async (instruction) => ({
//             ...instruction,
//             step: await translateToEnglish(instruction.step),
//           }))
//         ),
//       };
//       setTranslatedForm(translatedData);
//       // Store the translated data in localStorage
//       localStorage.setItem(
//         "translatedFormData",
//         JSON.stringify(translatedData)
//       );
//     } catch (error) {
//       console.error("Translation process failed:", error);
//       setTranslationError("Translation process failed. Please try again.");
//     } finally {
//       setIsTranslating(false);
//     }
//   };


//   const maxPortions = getMaxPortions();

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

//       <div className="flex flex-col items-center gap-2 mb-4">
//         <button
//           className={`custom-btn mt-4 px-4 py-2 bg-blue-500 text-white rounded-md ${
//             isTranslating
//               ? "opacity-50 cursor-not-allowed"
//               : "hover:bg-blue-600"
//           }`}
//           onClick={handleTranslate}
//           disabled={isTranslating}
//         >
//           {isTranslating ? "Translating..." : "Translate to English"}
//         </button>
//         {translationError && (
//           <p className="text-red-500 text-sm">{translationError}</p>
//         )}
//       </div>


//       <p className="text-3xl text-center font-semibold text-amber-500 pb-4 flex items-center justify-center gap-4">
//         Dish Overview <BiDish />
//       </p>
  

//       <div className="custom-text w-full mt-6">
//         <div className="flex items-center gap-4 border-b border-zinc-500">
//           <p className="p-1 py-2 font-semibold lg:text-xl">Dish Name - </p>
//           <span className="text-lg capitalize">{translatedForm.name}</span>
//         </div>
//         <div className="flex items-center gap-4 border-b border-zinc-500">
//           <p className="p-1 py-2 font-semibold lg:text-xl">Veg or Non-veg -</p>
//           <span className="text-lg">{translatedForm.veg_non_veg}</span>
//         </div>
//         {translatedForm.popularity_state && (
//           <div className="flex items-center gap-4 border-b border-zinc-500">
//             <p className="p-1 py-2 font-semibold lg:text-xl">
//               Popularity state -
//             </p>
//             <span className="text-lg">{translatedForm.popularity_state}</span>
//           </div>
//         )}
//         <div className="flex items-center gap-4 border-b border-zinc-500">
//           <p className="p-1 py-2 font-semibold lg:text-xl">Cuisine -</p>
//           <span className="text-lg">{translatedForm.cuisine}</span>
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
//                   {translatedForm.kitchen_equipments.length !== index + 1 &&
//                     ", "}
//                 </span>
//               ))}
//           </div>
//         </div>

//         <div className="flex gap-4 border-b border-zinc-500">
//           <p className="p-1 py-2 font-semibold lg:text-xl">Course Types -</p>
//           <div className="p-1 py-2">
//             {translatedForm.courses &&
//               translatedForm.courses.map((type, index) => (
//                 <span key={index} className="text-lg">
//                   {type.name}
//                   {translatedForm.courses.length !== index + 1 && ", "}
//                 </span>
//               ))}
//           </div>
//         </div>

//         {translatedForm.cooking_time && (
//           <div className="flex items-center gap-4 border-b border-zinc-500">
//             <p className="p-1 py-2 font-semibold lg:text-xl">Cooking time -</p>
//             <span className="text-lg">{translatedForm.cooking_time} min</span>
//           </div>
//         )}

//         {maxPortions > 1 && (
//           <div className="flex items-center gap-4 my-4">
//             <p className="font-semibold lg:text-xl">Select Portion:</p>
//             <select
//               value={selectedPortion}
//               onChange={(e) => setSelectedPortion(Number(e.target.value))}
//               className="px-3 py-1 border rounded-md"
//             >
//               {[...Array(maxPortions)].map((_, index) => (
//                 <option key={index} value={index}>
//                   Portion {index + 1}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {translatedForm.ingredients &&
//           translatedForm.ingredients.length > 0 && (
//             <div className="p-1 border-b border-zinc-500 py-2">
//               <h3 className="font-bold text-xl pt-2 underline mb-4">
//                 Ingredients{" "}
//                 {maxPortions > 1 ? `- Portion ${selectedPortion + 1}` : ""}
//               </h3>
//               <div className="space-y-2">
//                 {translatedForm.ingredients.map((ingredient, index) => {
//                   const quantity = Array.isArray(ingredient.quantity)
//                     ? ingredient.quantity[selectedPortion]
//                     : ingredient.quantity;

//                   return (
//                     quantity && (
//                       <div key={index} className="text-lg pl-4">
//                         {index + 1}. {ingredient.name} - {quantity}{" "}
//                         {ingredient.unit}
//                       </div>
//                     )
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//         {translatedForm.instructions &&
//           translatedForm.instructions.length > 0 && (
//             <div className="p-1 border-b border-zinc-500 py-2">
//               <h3 className="font-bold text-xl pt-2 underline mb-4">
//                 Instructions{" "}
//                 {maxPortions > 1 ? `- Portion ${selectedPortion + 1}` : ""}
//               </h3>
//               <div className="space-y-2">
//                 {translatedForm.instructions.map((instruction, index) => {
//                   const time = Array.isArray(instruction.time)
//                     ? instruction.time[selectedPortion]
//                     : instruction.time;

//                   return (
//                     <div key={index} className="text-lg pl-4">
//                       {index + 1}. {instruction.step}
//                       {time && <span className="ml-2">- {time} min</span>}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//       </div>
//     </div>
//   );
// };

// export default Overview;
