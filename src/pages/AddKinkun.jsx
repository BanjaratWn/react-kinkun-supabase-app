import React from "react";
import Footer from "./../components/Footer.jsx";
import food from "./../assets/food.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2"
import { supabase } from "./../lib/supabaseClient";
 
export default function AddKinkun() {
 
  //สร้าง state เพื่อจัดการกับข้อมูลต่างๆ บน component
  const [food_name, setFood_name] = useState("");
  const [food_where, setFood_where] = useState("");
  const [food_pay, setFood_pay] = useState();
  const [foodFile, setFoodFile] = useState(null);
  const [foodName, setFoodName] = useState("");
 
  //สร้างฟังก์ชันเลือกรูปและแสดงรูป
  const handleSelectImageAndPreview = (e) => {
    const file = e.target.files[0];
 
    if(file){
      setFoodFile(file);
      setFoodName(URL.createObjectURL(file));
    }
  }
 
  //สร้างฟังก์ชัน warningAlert
  const warningAlert = (msg) => {
     Swal.fire({
                icon: "warning",
                iconColor: "#E81A07",
                title: msg,
                showConfirmButton: true,
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#E81A07",
    });
  }
 
 
  //สร้างฟังก์ชัน successAlert
  const successAlert = (msg) => {
     Swal.fire({
                icon: "success",
                iconColor: "#108723",
                title: msg,
                showConfirmButton: true,
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#108723",
    }).then(()=>{
      window.location.href = "/showallkinkun";
    });
  }
 
  //สร้างฟังก์ชันบันทึกข้อมูลและอัปโหลดรูปไปที่ Supabase
  const handleSaveClick = async (e) => {
    e.preventDefault();
 
   
    //Validate UI
    if(food_name.trim().length === 0){
      warningAlert("กรุณากรอกกินอะไร ?");  
      return;
    }else if(food_where.trim().length === 0){
      warningAlert("กรุณากรอกกินที่ไหน ?");  
      return;
    }else if(food_pay === undefined || food_pay == ""){
      warningAlert("กรุณากรอกกินไปเท่าไหร่ ?");  
      return;
    }
 
    //อัปโหลดรูปไปที่ storage บน Supabase
    //และGet URL ของรูปที่ storage ของ Supabase มาเก็บในตัวแปร
    let food_image_url = '' //ตัวแปรเก็บ Url ของรูปที่อัปโหลดไปที่ Supabase
 
    if(foodFile){ //ตรวจสอบก่อนว่าได้เลือกรูปหรือไม่
      //เปลี่ยนชื่อไฟล์
      const newFileName = Date.now() + '-' + foodFile.name;
 
      //ทำการอัปโหลด
      const { error } = await supabase.storage
                                      .from('kinkun_bk')
                                      .upload(newFileName, foodFile);
 
      if(error){
        warningAlert("เกิดข้อผิดพลาดในการอัปโหลดรูป กรุณาลองใหม่อีกครั้ง...");
        return;
      }
 
      //กรณีอัปโหลดสำเร็จต้องไป Get URL ของรูปที่ storage ของ Supabase มาเก็บในตัวแปร
      const { data } = supabase.storage
                                    .from('kinkun_bk')
                                    .getPublicUrl(newFileName);
 
      food_image_url = data.publicUrl;      
    }
 
    //บันทึกข้อมูลไปที่ table บน Supabase
    const { error } = await supabase.from('kinkun_tb')
                                    .insert({
                                      food_name: food_name,
                                      food_where: food_where,
                                      food_pay: food_pay,
                                      food_image_url: food_image_url
                                    })
 
    if(error){
        warningAlert("เกิดข้อผิดพลาดในการเพิ่มข้อมูล กรุณาลองใหม่อีกครั้ง...");
        return;
    }                  
   
    successAlert('บันทึกเพิ่มการกินเรียบร้อยแล้ว')    
 
    //Redirect ไปยังหน้า ShowAllKinkun
    //(ไปเขียน redirect ที่ฟังก์ชัน successAlert ด้วย)
    //document.location.href = '/showallkinkun';  
  }
 
  return (
    <div>
      <div className="w-10/12 mx-auto border-gray-300 p-6 shadow-md mt-20 rounded-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Kinkun APP (Supabase)
        </h1>
 
        <h1 className="text-2xl font-bold text-center text-blue-700">
          เพิ่มข้อมูลการกิน
        </h1>
 
        <img src={food} alt="กินกัน" className="block mx-auto w-20 mt-5 mb-5" />
 
        <form onSubmit={handleSaveClick}>
            <div>
              <label>กินอะไร ?</label>
              <input  value={food_name} onChange={(e) => setFood_name(e.target.value)}
                      placeholder="เช่น Pizza, KFC, ...."
                      type="text" className="border border-gray-400 w-full p-2 mt-1 rounded" />
            </div>
 
            <div className="mt-3">
              <label>กินที่ไหน ?</label>
              <input  value={food_where} onChange={(e) => setFood_where(e.target.value)}
                      placeholder="เช่น KFC หนองแขม, Pizza หน้ามอเอเชีย, ...."
                      type="text" className="border border-gray-400 w-full p-2 mt-1 rounded" />
            </div>
 
            <div className="mt-3">
              <label>กินไปเท่าไหร่ ?</label>
              <input  value={food_pay} onChange={(e) => setFood_pay(e.target.value)}
                      placeholder="เช่น 100, 299.50, ...."
                      type="number" className="border border-gray-400 w-full p-2 mt-1 rounded" />
            </div>
 
            <div className="mt-3">
              <label>รูปกิน ?</label>
              <input  onChange={handleSelectImageAndPreview}
                      type="file" className="hidden" id="imageSelect" accept="image/*" />
              <label htmlFor="imageSelect"
                    className="py-2 px-4 bg-blue-500 hover:bg-blue-700 cursor-pointer
                              text-white rounded block w-30 text-center">
                เลือกรูป
              </label>
              <div className="mt-3">
                {
                  foodName && <img src={foodName} alt="รูปกิน" className="w-30" />
                }
              </div>
            </div>  
 
            <div className="mt-4">
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 cursor-pointer
                                p-2 text-white rounded">
                บันทึกการกิน
              </button>
            </div>
        </form>        
 
        <div className="text-center mt-4">
          <Link to="/showallkinkun" className="hover:text-blue-700">
            กลับไปหน้าแสดงข้อมูลการกิน
          </Link>
        </div>
      </div>
 
      <Footer />
    </div>
  );
}