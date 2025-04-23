'use client';
import { createClient } from "@/lib/supabase";
import { get } from "http";
import { useEffect, useState } from "react";

export default function Home() {
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);

  const handleLogout = async () => {
    const { error } = await createClient().auth.signOut();

    if (error) {
      console.error("Error logging out:", error);
    } else {
      window.location.href = "/login";
    }
  };


  
 

  

  const getUserId = async () => {

    const {data: userid} = await createClient().auth.getUser();



    const { data:  user } = await createClient()
      .from('users')
      .select('name')
      .eq('id', `${userid.user?.id}`)

      console.log('user', user)

    if (!user || user.length === 0) {
      console.error("Error fetching user ID");
      return;
    }

    setUserName(user[0]?.name);

  }
 
  useEffect(() => {
    // getUser();
    getUserId();
   
  }, []);

  return (
    <div className="m-10">
      <h1>Logged in</h1>
      <h1>{userName ? `Welcome, ${userName}` : "Loading..."}</h1>
      <button onClick={handleLogout}>Sign out</button>
    </div>
  );
}
