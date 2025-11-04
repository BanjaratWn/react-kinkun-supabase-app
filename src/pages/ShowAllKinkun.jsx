import React from "react";
import food from "./../assets/food.png";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./../lib/supabaseClient";

export default function ShowAllKinkun() {
  const [kinkuns, setKinkuns] = useState([]);

  useEffect(() => {
    try {
      // โค้ดที่จะให้ทำงานเมื่อมี Effect เกิดขึ้นกับ Component
      // ดึงข้อมูลการกินทั้งหมดจาก Supabase โดยสร้างเป็นฟังก์ชัน
      const fetchKinkuns = async () => {
        // ดึงจาก Supabase
        const { data, error } = await supabase
          .from("kinkun_tb")
          .select("*")
          .order("created_at", { ascending: false });
        // ดึงแล้วตรวจสอบ error
        if (error) {
          alert("เกิดข้อผิดพลาดในการดึงข้อมูลการกิน กรุณาลองใหม่อีกครั้ง");
          console.log("Fetch error : ", error);
        } else {
          // เอาค่าที่ดึงมาไปเก็บไว้ที่ State : kinkuns
          setKinkuns(data);
        }
      };
      // เรียกใช้ฟังก์ชันดึงข้อมูล
      fetchKinkuns();
    } catch (ex) {
      alert("เกิดข้อผิดพลาดในการดึงข้อมูลการกิน กรุณาลองใหม่อีกครั้ง");
      console.log("Fetch error : ", ex);
    }
  }, []);

  return (
    <div>
      <div className="w-10/12 mx-auto border-gray-300 p-4 shadow-lg mb-5">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Kinkun APP (Supabase)
        </h1>
        <h1 className="text-2xl font-bold text-center text-blue-700">
          บันทึกการกิน
        </h1>

        <img src={food} alt="กินกัน" className="block mx-auto w-30 mt-5" />

        {/* ส่วนแสดงปุ่มเพิ่ม เพื่อเปิดหน้าจออ /addkinkun */}
        <div className="my-8 flex justify-end">
          <Link
            to="/addkinkun"
            className="bg-blue-700 p-3 rounded
                                            hover:bg-blue-800 text-white"
          >
            เพิ่มการกิน
          </Link>
        </div>

        {/* ส่วนแสดงข้อมูลการกินทั้งหมดที่ดึงมาจาก Supabase โดยจะแสดงเป็นตาราง */}
        <table className="w-full border border-gray-700 text-sm">
          <thead>
            <tr className="bg-gray-300">
              <th className="border border-gray-700 p-2">รูป</th>
              <th className="border border-gray-700 p-2">กินอะไร</th>
              <th className="border border-gray-700 p-2">กินที่ไหน</th>
              <th className="border border-gray-700 p-2">กินไปเท่าไหร่</th>
              <th className="border border-gray-700 p-2">วันไหน</th>
              <th className="border border-gray-700 p-2">ACTION</th>
            </tr>
            </thead>
            <tbody>
              {kinkuns.map((kinkun) => (
                <tr key={kinkun.id}>
                  <td className="border border-gray-700 p-2 text-center">
                    {
                      kinkun.food_image_url === '' || kinkun.food_image_url === null
                      ? '-'
                      : <img src={kinkun.food_image_url} alt="รูปอาหาร" className="w-20 mx-auto" />
                    }
                  </td>
                  <td className="border border-gray-700 p-2">{kinkun.food_name}</td>
                  <td className="border border-gray-700 p-2">{kinkun.food_where}</td>
                  <td className="border border-gray-700 p-2">{kinkun.food_pay}</td>
                  <td className="border border-gray-700 p-2">
                    {new Date(kinkun.created_at).toLocaleDateString("th-TH")}
                  </td>
                  <td className="border border-gray-700 p-2">
                    แก้ไข | ลบ
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
}
